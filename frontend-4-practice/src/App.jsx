// App — корневой компонент страницы «Выбор даты и времени».
//
// Данные приходят с сервера (см. src/api.js):
//   1. При открытии страницы загружаем «сегодня» — fetchToday().
//   2. Когда выбран день — загружаем его слоты — fetchSlots(date).
// У каждой загрузки три состояния: loading → error или data.
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BottomBar from "./components/BottomBar.jsx";
import Footer from "./components/Footer.jsx";
import Status from "./components/Status.jsx";
import { ScissorsIcon, UserIcon } from "./components/Icons.jsx";
import { fetchSlots, fetchToday } from "./api.js";
import { isSameDate, shiftMonth } from "./utils/date.js";

// Мастер и услуга выбраны на прошлых шагах записи.
const MASTER = "Дмитрий Орлов";
const SERVICE = { title: "Мужская стрижка", price: "2 200 ₽", durationMin: 60 };

// Понятный текст ошибки: если сервер вообще не ответил, браузер пишет
// "Failed to fetch" — заменяем на русский.
function getErrorText(err) {
  if (err instanceof TypeError) return "Сервер не отвечает.";
  return err.message;
}

function App() {
  // --- «Сегодня» с сервера ---
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [todayAttempt, setTodayAttempt] = useState(0); // для кнопки «Повторить»

  // --- Календарь и выбор ---
  const [view, setView] = useState(null); // показанный месяц { year, month }
  const [selectedDate, setSelectedDate] = useState(null); // { year, month, day }
  const [selectedTime, setSelectedTime] = useState(null); // "18:00" или null

  // --- Слоты выбранного дня с сервера ---
  const [slots, setSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsAttempt, setSlotsAttempt] = useState(0);

  // 1. Загружаем «сегодня» при открытии страницы.
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setTodayLoading(true);
        setTodayError(null);
        const data = await fetchToday();
        if (ignore) return;
        // Сервер отдаёт { day, month, year } — в приложении тот же формат.
        const serverToday = { year: data.year, month: data.month, day: data.day };
        setToday(serverToday);
        // Инициализируем календарь: показываем месяц «сегодня» и выбираем этот день.
        setView({ year: serverToday.year, month: serverToday.month });
        setSelectedDate(serverToday);
      } catch (err) {
        if (!ignore) setTodayError(getErrorText(err));
      } finally {
        if (!ignore) setTodayLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [todayAttempt]);

  // 2. Загружаем слоты каждый раз, когда меняется выбранный день.
  useEffect(() => {
    if (!selectedDate) return;
    let ignore = false;

    async function load() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        const data = await fetchSlots(selectedDate);
        // Если пользователь успел кликнуть другой день, этот ответ уже не нужен.
        // Проверяем и флаг, и дату в ответе сервера.
        if (ignore || !isSameDate(data.date, selectedDate)) return;
        setSlots(data.slots);
      } catch (err) {
        if (!ignore) setSlotsError(getErrorText(err));
      } finally {
        if (!ignore) setSlotsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [selectedDate, slotsAttempt]);

  function handleSelectDay(date) {
    if (isSameDate(date, selectedDate)) return;
    setSelectedDate(date);
    setSelectedTime(null); // время с прошлого дня обязательно сбрасываем
    setSlots(null);
  }

  function handlePrevMonth() {
    setView(shiftMonth(view.year, view.month, -1));
  }

  function handleNextMonth() {
    setView(shiftMonth(view.year, view.month, 1));
  }

  // Основная часть страницы зависит от того, загрузилось ли «сегодня».
  function renderBooking() {
    if (todayLoading) {
      return <Status type="loading" size="l" text="Загружаем календарь…" />;
    }
    if (todayError) {
      return (
        <Status
          type="error"
          size="l"
          text={"Не удалось загрузить календарь. " + todayError}
          onRetry={() => setTodayAttempt((n) => n + 1)}
        />
      );
    }

    return (
      <>
        <div className="booking__grid">
          <Calendar
            view={view}
            today={today}
            selectedDate={selectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDay={handleSelectDay}
          />
          <TimeSlots
            date={selectedDate}
            slots={slots}
            loading={slotsLoading}
            error={slotsError}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            onRetry={() => setSlotsAttempt((n) => n + 1)}
          />
        </div>

        <BottomBar date={selectedDate} time={selectedTime} service={SERVICE} />
      </>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="main">
        <StepIndicator current={3} />

        <section className="booking">
          <div className="booking__intro">
            <h1 className="booking__title">Выберите дату и время</h1>
            <p className="booking__text">
              Показываем свободные окна мастера Дмитрия Орлова на ближайший месяц.
            </p>
          </div>

          <ul className="chosen">
            <li className="chip">
              <UserIcon className="chip__icon" />
              {MASTER}
            </li>
            <li className="chip">
              <ScissorsIcon className="chip__icon" size={14} />
              {SERVICE.title} · {SERVICE.durationMin} мин
            </li>
          </ul>

          {renderBooking()}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
