import { Fragment } from "react";
import { CheckIcon, ChevronIcon } from "./Icons.jsx";

const STEPS = ["Мастер", "Услуга", "Дата и время", "Контакты", "Подтверждение"];

// Шаги записи. current — номер текущего шага (с 1).
function StepIndicator({ current }) {
  return (
    <section className="steps">
      <div className="steps__inner">
        <div className="steps__top">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a className="breadcrumbs__link" href="#">Главная</a>
            <ChevronIcon className="breadcrumbs__icon" size={14} />
            <span className="breadcrumbs__current">Онлайн-запись</span>
          </nav>
          <p className="steps__counter">
            Шаг {current} из {STEPS.length}
          </p>
        </div>

        <ol className="progress">
          {STEPS.map((title, index) => {
            const number = index + 1;
            let stepClass = "progress__step";
            if (number < current) stepClass += " progress__step_state_done";
            if (number === current) stepClass += " progress__step_state_current";

            return (
              <Fragment key={title}>
                {index > 0 && (
                  <li
                    className={"progress__line" + (number <= current ? " progress__line_state_done" : "")}
                    aria-hidden="true"
                  />
                )}
                <li className={stepClass}>
                  <span className="progress__circle">
                    {number < current ? <CheckIcon /> : number}
                  </span>
                  <span className="progress__label">{title}</span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default StepIndicator;
