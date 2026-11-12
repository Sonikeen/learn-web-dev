import { PERIODS, countFreeSlots } from "../data/booking.js";
import { formatDayMonth, getWeekdayName, pluralize } from "../utils/date.js";

// Свободное время на выбранный день, разбитое на утро / день / вечер.
function TimeSlots({ date, slots, selectedTime, onSelectTime }) {
  const free = countFreeSlots(slots);

  return (
    <article className="card slots">
      <div className="slots__head">
        <h2 className="card__title">
          {getWeekdayName(date)}, {formatDayMonth(date)}
        </h2>
        <p className="slots__caption">
          {free > 0
            ? "Свободно " + free + " " + pluralize(free, "окно", "окна", "окон") + " · время московское"
            : "Свободных окон нет · время московское"}
        </p>
      </div>

      {free === 0 ? (
        <p className="slots__empty">На этот день всё занято. Выберите другой день в календаре.</p>
      ) : (
        <div className="slots__body">
          {PERIODS.map((period) => (
            <div className="slots__group" key={period.id}>
              <h3 className="slots__label">{period.title}</h3>
              <div className="slots__list">
                {slots
                  .filter((slot) => slot.period === period.id)
                  .map((slot) => {
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
          ))}
        </div>
      )}
    </article>
  );
}

export default TimeSlots;
