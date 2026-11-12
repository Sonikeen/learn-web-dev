import { ScissorsIcon } from "./Icons.jsx";

// Логотип используется и в шапке, и в подвале.
function Logo() {
  return (
    <a className="logo" href="#">
      <span className="logo__sign">
        <ScissorsIcon className="logo__icon" />
      </span>
      <span className="logo__text">
        <span className="logo__title">Медь</span>
        <span className="logo__subtitle">барбершоп · с 2016</span>
      </span>
    </a>
  );
}

export default Logo;
