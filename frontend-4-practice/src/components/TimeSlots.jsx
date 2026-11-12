import Status from "./Status.jsx";
import { PERIODS, formatDayMonth, getPeriod, getWeekdayName, pluralize } from "../utils/date.js";

// Свободное время на выбранный день, разбитое на утро / день / вечер.
// Слоты приходят с сервера, поэтому есть три состояния:
// loading — идёт запрос, error — запрос упал, иначе — рисуем slots.
function TimeSlots({ date, slots, loading: isFetching, error, selectedTime, onSelectTime, onRetry }) {
  // Пока ответа ещё нет (slots === null), тоже считаем, что идёт загрузка.
  const loading = isFetching || (!error && slots === null);
  const free = slots ? slots.filter((slot) => slot.available).length : 0;

  let caption = "Загружаем свободное время…";
  if (error) caption = "Не удалось загрузить время";
  else if (!loading && free > 0) {
    caption = "Свободно " + free + " " + pluralize(free, "окно", "окна", "окон") + " · время московское";
  } else if (!loading) caption = "Свободных окон нет · время московское";

  function renderBody() {
    if (loading) {
      return <Status type="loading" text="Загружаем свободное время…" />;
    }
    if (error) {
      return <Status type="error" text={"Ошибка: " + error} onRetry={onRetry} />;
    }
    if (free === 0) {
      return <p className="slots__empty">На этот день всё занято. Выберите другой день в календаре.</p>;
    }

    return (
      <div className="slots__body">
        {PERIODS.map((period) => {
          const periodSlots = slots.filter((slot) => getPeriod(slot.time) === period.id);
          if (periodSlots.length === 0) return null;

          return (
            <div className="slots__group" key={period.id}>
              <h3 className="slots__label">{period.title}</h3>
              <div className="slots__list">
                {periodSlots.map((slot) => {
                  let className = "slot";
                  if (!slot.available) className += " slot_state_busy";
                  if (slot.time === selectedTime) className += " slot_state_selected";

                  return (
                    <button
                      key={slot.time}
                      className={className}
                      type="button"
                      disabled={!slot.available}
                      aria-pressed={slot.time === selectedTime}
                      onClick={() => onSelectTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <article className="card slots" aria-busy={loading}>
      <div className="slots__head">
        <h2 className="card__title">
          {getWeekdayName(date)}, {formatDayMonth(date)}
        </h2>
        <p className="slots__caption">{caption}</p>
      </div>

      {renderBody()}
    </article>
  );
}

export default TimeSlots;
