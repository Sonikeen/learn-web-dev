// Чистые функции для работы с датами.
// Не зависят ни от React, ни от DOM — перенесены из нативной версии.
// Формат даты — { year, month, day }, месяц с нуля (9 = октябрь).

export const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const WEEKDAYS = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

// Строит сетку календаря: массив недель по 7 ячеек.
export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// Сравнивает две даты: -1 — a раньше, 1 — a позже, 0 — один день.
export function compareDates(a, b) {
  const d1 = new Date(a.year, a.month, a.day);
  const d2 = new Date(b.year, b.month, b.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

export function isSameDate(a, b) {
  return a !== null && b !== null && compareDates(a, b) === 0;
}

// Можно ли выбрать день — не раньше «сегодня».
export function isSelectable(date, today) {
  return compareDates(date, today) >= 0;
}

// Ключ даты: { 2026, 9, 5 } → "2026-10-05".
export function dateKey(date) {
  const mm = String(date.month + 1).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  return date.year + "-" + mm + "-" + dd;
}

// Следующий / предыдущий месяц с переходом через год.
export function shiftMonth(year, month, step) {
  const d = new Date(year, month + step, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function getWeekdayName(date) {
  return WEEKDAYS[new Date(date.year, date.month, date.day).getDay()];
}

// { 2026, 9, 28 } → "28 октября"
export function formatDayMonth(date) {
  return date.day + " " + MONTHS_GENITIVE[date.month];
}

// "18:00" + 60 минут → "19:00".
export function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return hh + ":" + mm;
}

// Склонение: 1 окно, 2 окна, 5 окон.
export function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

// К какой части дня относится время: "10:00" → "morning".
// Сервер отдаёт только { time, available }, группировку делаем на клиенте.
export function getPeriod(time) {
  const hour = Number(time.split(":")[0]);
  if (hour < 12) return "morning";
  if (hour < 18) return "day";
  return "evening";
}

export const PERIODS = [
  { id: "morning", title: "Утро" },
  { id: "day", title: "День" },
  { id: "evening", title: "Вечер" },
];
