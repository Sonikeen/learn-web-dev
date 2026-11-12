import Logo from "./Logo.jsx";
import { ClockIcon, InstagramIcon, MessageIcon, PhoneIcon, PinIcon, SendIcon } from "./Icons.jsx";

const SOCIALS = [
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "Telegram", icon: <SendIcon /> },
  { label: "Написать нам", icon: <MessageIcon /> },
];

const CLIENT_LINKS = ["Услуги и цены", "Подарочные сертификаты", "Вакансии"];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__columns">
          <div className="footer__about">
            <Logo />
            <p className="footer__text">
              Мужские стрижки, бритьё и уход за бородой. Варим кофе, ставим винил и никогда не торопимся.
            </p>
            <ul className="socials">
              {SOCIALS.map((item) => (
                <li className="socials__item" key={item.label}>
                  <a className="socials__link" href="#" aria-label={item.label}>
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h2 className="footer__heading">Контакты</h2>
            <address className="footer__list">
              <p className="footer__row">
                <PinIcon className="footer__icon" />
                Москва, ул. Садовая, 15
              </p>
              <a className="footer__row footer__row_type_phone" href="tel:+74951234567">
                <PhoneIcon className="footer__icon" />
                +7 (495) 123-45-67
              </a>
              <a className="footer__row footer__link" href="mailto:hello@med-barber.ru">
                <MessageIcon className="footer__icon" size={16} />
                hello@med-barber.ru
              </a>
            </address>
          </div>

          <div className="footer__column">
            <h2 className="footer__heading">Режим работы</h2>
            <div className="footer__list">
              <p className="footer__row">
                <ClockIcon className="footer__icon" />
                Пн–Пт: 9:00 – 21:00
              </p>
              <p className="footer__row">Сб–Вс: 10:00 – 19:00</p>
            </div>
          </div>

          <nav className="footer__column">
            <h2 className="footer__heading">Клиентам</h2>
            <ul className="footer__list">
              {CLIENT_LINKS.map((title) => (
                <li className="footer__item" key={title}>
                  <a className="footer__row footer__link" href="#">{title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2026 Барбершоп «Медь». Все права защищены.</p>
          <a className="footer__copy footer__link" href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
