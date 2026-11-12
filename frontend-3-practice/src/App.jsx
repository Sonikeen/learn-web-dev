// App — корневой компонент страницы «Выбор даты и времени».
// Здесь живёт всё состояние страницы, а дочерние компоненты
// получают данные и колбэки через пропсы.
import { useState } from "react";
import Header from "./components/Header.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BottomBar from "./components/BottomBar.jsx";
import Footer from "./components/Footer.jsx";
import { ScissorsIcon, UserIcon } from "./components/Icons.jsx";
import { DEFAULT_DATE, MASTER, SERVICE, TODAY, getSlotsForDate } from "./data/booking.js";
import { shiftMonth } from "./utils/date.js";

function App() {
  // Какой месяц показан в календаре.
  const [view, setView] = useState({ year: DEFAULT_DATE.year, month: DEFAULT_DATE.month });
  // Выбранный день { year, month, day }.
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  // Выбранное время, например "18:00", или null.
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты не храним отдельно — они вычисляются из выбранного дня.
  const slots = getSlotsForDate(selectedDate);

  function handleSelectDay(date) {
    setSelectedDate(date);
    setSelectedTime(null); // время с прошлого дня обязательно сбрасываем
  }

  function handlePrevMonth() {
    setView(shiftMonth(view.year, view.month, -1));
  }

  function handleNextMonth() {
    setView(shiftMonth(view.year, view.month, 1));
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

          <div className="booking__grid">
            <Calendar
              view={view}
              today={TODAY}
              selectedDate={selectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDay={handleSelectDay}
            />
            <TimeSlots
              date={selectedDate}
              slots={slots}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          </div>

          <BottomBar date={selectedDate} time={selectedTime} service={SERVICE} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
