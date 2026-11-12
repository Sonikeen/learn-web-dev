import { ChevronIcon } from "./Icons.jsx";
import { getSlotsForDate, countFreeSlots } from "../data/booking.js";
import { MONTHS, buildCalendarGrid, isSameDate, isSelectable } from "../utils/date.js";

const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Календарь месяца.
// view — какой месяц показан { year, month };
// onSelectDay вызывается с датой { year, month, day }.
function Calendar({ view, today, selectedDate, onPrevMonth, onNextMonth, onSelectDay }) {
  const cells = buildCalendarGrid(view.year, view.month).flat();
  const isFirstMonth = view.year === today.year && view.month === today.month;

  return (
    <article className="card calendar">
      <div className="calendar__head">
        <h2 className="card__title">
          {MONTHS[view.month]} {view.year}
        </h2>
        <div className="calendar__arrows">
          <button
            className="icon-button"
            type="button"
            aria-label="Предыдущий месяц"
            disabled={isFirstMonth}
            onClick={onPrevMonth}
          >
            <ChevronIcon direction="left" />
          </button>
          <button className="icon-button" type="button" aria-label="Следующий месяц" onClick={onNextMonth}>
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <ul className="calendar__weekdays">
        {WEEKDAYS_SHORT.map((name, index) => (
          <li
            key={name}
            className={"calendar__weekday" + (index >= 5 ? " calendar__weekday_type_weekend" : "")}
          >
            {name}
          </li>
        ))}
      </ul>

      <div className="calendar__days">
        {cells.map((cell, index) => {
          // Дни соседних месяцев — пустые ячейки, как в макете.
          if (cell.otherMonth) {
            return <span key={index} className="day day_type_empty" />;
          }

          const date = { year: view.year, month: view.month, day: cell.day };

          if (!isSelectable(date, today)) {
            return (
              <button key={index} className="day day_state_past" type="button" disabled>
                {cell.day}
              </button>
            );
          }

          let className = "day";
          if (isSameDate(date, today)) className += " day_state_today";
          if (countFreeSlots(getSlotsForDate(date)) === 0) className += " day_state_full";
          const isSelected = isSameDate(date, selectedDate);
          if (isSelected) className += " day_state_selected";

          return (
            <button
              key={index}
              className={className}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectDay(date)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <ul className="legend">
        <li className="legend__item">
          <span className="legend__mark legend__mark_type_selected" />
          Выбранный день
        </li>
        <li className="legend__item">
          <span className="legend__mark legend__mark_type_today" />
          Сегодня
        </li>
        <li className="legend__item">
          <span className="legend__mark legend__mark_type_full" />
          Нет свободного времени
        </li>
      </ul>
    </article>
  );
}

export default Calendar;
