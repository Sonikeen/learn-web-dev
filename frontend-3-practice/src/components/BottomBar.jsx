import { addMinutes, formatDayMonth, getWeekdayName } from "../utils/date.js";

// Нижняя панель: что выбрано и кнопка перехода к следующему шагу.
function BottomBar({ date, time, service }) {
  const dayText = getWeekdayName(date) + ", " + formatDayMonth(date) + " " + date.year;
  const timeText = time ? time + "–" + addMinutes(time, service.durationMin) : "выберите время";

  function handleNext(event) {
    // Пока время не выбрано, на следующий шаг не пускаем.
    if (!time) {
      event.preventDefault();
    }
  }

  return (
    <div className="step-nav">
      <a className="button button_type_ghost" href="#">Назад</a>
      <div className="step-nav__right">
        <div className="summary">
          <p className="summary__date">
            {dayText} • {timeText}
          </p>
          <p className="summary__service">
            {service.title} · {service.price}
          </p>
        </div>
        <a
          className={"button button_type_primary" + (time ? "" : " button_state_disabled")}
          href="#"
          aria-disabled={!time}
          onClick={handleNext}
        >
          Далее: контакты
        </a>
      </div>
    </div>
  );
}

export default BottomBar;
