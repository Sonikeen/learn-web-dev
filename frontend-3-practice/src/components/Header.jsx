import Logo from "./Logo.jsx";
import { PhoneIcon } from "./Icons.jsx";

const MENU = ["Услуги", "Мастера", "Отзывы", "Контакты"];

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Logo />

        <nav className="header__nav">
          <ul className="menu">
            {MENU.map((item) => (
              <li className="menu__item" key={item}>
                <a className="menu__link" href="#">{item}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="phone" href="tel:+74951234567">
            <PhoneIcon className="phone__icon" />
            +7 (495) 123-45-67
          </a>
          <a className="button button_type_primary button_size_s" href="#">Записаться</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
