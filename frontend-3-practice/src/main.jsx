// Точка входа React-приложения.
//
// Этот файл запускается первым. Его подключает index.html.
// Здесь создаётся корень React-дерева и монтируется компонент App.
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/booking.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
