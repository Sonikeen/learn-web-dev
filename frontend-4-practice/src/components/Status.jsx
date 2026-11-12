// Заглушка для состояний загрузки и ошибки.
// type: "loading" | "error". onRetry — кнопка «Повторить» для ошибки.
function Status({ type, text, onRetry, size }) {
  let className = "status";
  if (type === "error") className += " status_type_error";
  if (size === "l") className += " status_size_l";

  return (
    <div className={className} role={type === "error" ? "alert" : "status"}>
      {type === "loading" && <span className="status__spinner" aria-hidden="true" />}
      <p className="status__text">{text}</p>
      {type === "error" && onRetry && (
        <button className="status__retry" type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

export default Status;
