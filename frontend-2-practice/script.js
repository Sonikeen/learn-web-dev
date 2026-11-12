// JavaScript для страницы выбора даты и времени.
// Барбершоп «Медь», шаг 3 из 5 — «Дата и время».
//
// Что работает:
//   1. При открытии страницы выбран день по умолчанию и показаны его слоты.
//   2. Клик по дню — день выбирается, слоты обновляются, время сбрасывается.
//   3. Клик по слоту — время выбирается и попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы (через декабрь/январь меняется год).
//   5. Дни раньше «сегодня» не кликаются и выглядят приглушённо.
//   6. Нижняя панель обновляется при выборе дня и времени.

// ============================================================
// 1. ДАННЫЕ
// ============================================================

// «Сегодня» захардкожено, чтобы страница совпадала с макетом
// и проверка не зависела от того, в какой день её открыли.
// Формат даты — { year, month, day }, месяц с нуля (9 = октябрь).
const TODAY = { year: 2026, month: 9, day: 23 };

// День, который выбран при открытии страницы (как в макете).
const DEFAULT_DATE = { year: 2026, month: 9, day: 28 };

// Сетка времени мастера на любой рабочий день.
const TIME_SLOTS = [
  { time: "10:00", period: "morning" },
  { time: "10:30", period: "morning" },
  { time: "11:00", period: "morning" },
  { time: "12:00", period: "day" },
  { time: "13:00", period: "day" },
  { time: "14:00", period: "day" },
  { time: "15:00", period: "day" },
  { time: "16:30", period: "day" },
  { time: "17:00", period: "day" },
  { time: "18:00", period: "evening" },
  { time: "19:00", period: "evening" },
  { time: "20:00", period: "evening" },
];

const PERIODS = [
  { id: "morning", title: "Утро" },
  { id: "day", title: "День" },
  { id: "evening", title: "Вечер" },
];

// Занятое время по конкретным датам (ключ — "ГГГГ-ММ-ДД").
// "all" — весь день занят, свободного времени нет.
// Для дат, которых нет в списке, занятость считается по формуле
// в getSlotsForDate — чтобы у каждого дня были свои слоты.
const BUSY_TIMES = {
  "2026-10-23": ["10:00", "10:30", "11:00", "12:00", "15:00"],
  "2026-10-24": ["12:00", "13:00", "14:00", "18:00", "19:00"],
  "2026-10-25": "all",
  "2026-10-28": ["11:00", "13:00", "17:00", "20:00"],
  "2026-10-31": "all",
  "2026-11-07": "all",
  "2026-11-15": "all",
};

const SERVICE = { title: "Мужская стрижка", price: "2 200 ₽", durationMin: 60 };

const MONTHS = [
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

// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================

const state = {
  viewYear: DEFAULT_DATE.year, // какой месяц сейчас показан в календаре
  viewMonth: DEFAULT_DATE.month,
  selectedDate: { ...DEFAULT_DATE }, // выбранный день
  selectedTime: null, // выбранное время, например "18:00"
};

// ============================================================
// 3. ЧИСТЫЕ ФУНКЦИИ (не зависят от DOM)
// ============================================================

// Строит сетку календаря: массив недель по 7 ячеек.
function buildCalendarGrid(year, month) {
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
function compareDates(a, b) {
  const d1 = new Date(a.year, a.month, a.day);
  const d2 = new Date(b.year, b.month, b.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isSameDate(a, b) {
  return a !== null && b !== null && compareDates(a, b) === 0;
}

// Можно ли выбрать день — не раньше «сегодня».
function isSelectable(date) {
  return compareDates(date, TODAY) >= 0;
}

// Ключ даты для поиска в BUSY_TIMES: { 2026, 9, 5 } → "2026-10-05".
function dateKey(date) {
  const mm = String(date.month + 1).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  return `${date.year}-${mm}-${dd}`;
}

// Слоты на конкретный день: [{ time, period, available }].
function getSlotsForDate(date) {
  const busy = BUSY_TIMES[dateKey(date)];

  return TIME_SLOTS.map((slot, index) => {
    let available;
    if (busy === "all") {
      available = false;
    } else if (Array.isArray(busy)) {
      available = !busy.includes(slot.time);
    } else {
      // Для остальных дат — «случайная», но всегда одинаковая занятость.
      available = (date.day * 3 + index) % 4 !== 0;
    }
    return { time: slot.time, period: slot.period, available: available };
  });
}

function countFreeSlots(slots) {
  return slots.filter((slot) => slot.available).length;
}

// Склонение: 1 окно, 2 окна, 5 окон.
function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

// "18:00" + 60 минут → "19:00".
function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getWeekdayName(date) {
  return WEEKDAYS[new Date(date.year, date.month, date.day).getDay()];
}

// { 2026, 9, 28 } → "28 октября"
function formatDayMonth(date) {
  return `${date.day} ${MONTHS_GENITIVE[date.month]}`;
}

// Следующий / предыдущий месяц с переходом через год.
function shiftMonth(year, month, step) {
  const d = new Date(year, month + step, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

// ============================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================

const monthTitle = document.querySelector("#month-title");
const prevButton = document.querySelector("#prev-month");
const nextButton = document.querySelector("#next-month");
const daysContainer = document.querySelector("#calendar-days");
const slotsTitle = document.querySelector("#slots-title");
const slotsCaption = document.querySelector("#slots-caption");
const slotsBody = document.querySelector("#slots-body");
const summaryDate = document.querySelector("#summary-date");
const nextStepButton = document.querySelector("#next-step");

// --- Календарь ---

function renderCalendar() {
  monthTitle.textContent = `${MONTHS[state.viewMonth]} ${state.viewYear}`;

  // Листать в прошлое раньше текущего месяца нельзя.
  prevButton.disabled =
    state.viewYear === TODAY.year && state.viewMonth === TODAY.month;

  const weeks = buildCalendarGrid(state.viewYear, state.viewMonth);
  let html = "";

  weeks.forEach((week) => {
    week.forEach((cell) => {
      // Дни соседних месяцев — пустые ячейки, как в макете.
      if (cell.otherMonth) {
        html += '<span class="day day_type_empty"></span>';
        return;
      }

      const date = { year: state.viewYear, month: state.viewMonth, day: cell.day };
      let classes = "day";

      if (!isSelectable(date)) {
        html += `<button class="day day_state_past" type="button" disabled>${cell.day}</button>`;
        return;
      }

      if (isSameDate(date, TODAY)) classes += " day_state_today";
      if (countFreeSlots(getSlotsForDate(date)) === 0) classes += " day_state_full";
      if (isSameDate(date, state.selectedDate)) classes += " day_state_selected";

      html += `<button class="${classes}" type="button" data-day="${cell.day}">${cell.day}</button>`;
    });
  });

  daysContainer.innerHTML = html;

  // После innerHTML старые обработчики пропали — вешаем заново.
  // Только на доступные дни: у прошлых нет data-day.
  daysContainer.querySelectorAll(".day[data-day]").forEach((button) => {
    button.addEventListener("click", onDayClick);
  });
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.dataset.day, 10);
  state.selectedDate = { year: state.viewYear, month: state.viewMonth, day: day };
  state.selectedTime = null; // время с прошлого дня сбрасываем обязательно
  render();
}

function onPrevMonth() {
  const prev = shiftMonth(state.viewYear, state.viewMonth, -1);
  state.viewYear = prev.year;
  state.viewMonth = prev.month;
  renderCalendar();
}

function onNextMonth() {
  const next = shiftMonth(state.viewYear, state.viewMonth, 1);
  state.viewYear = next.year;
  state.viewMonth = next.month;
  renderCalendar();
}

// --- Слоты ---

function renderSlots() {
  const date = state.selectedDate;
  const slots = getSlotsForDate(date);
  const free = countFreeSlots(slots);

  slotsTitle.textContent = `${getWeekdayName(date)}, ${formatDayMonth(date)}`;

  if (free === 0) {
    slotsCaption.textContent = "Свободных окон нет · время московское";
    slotsBody.innerHTML =
      '<p class="slots__empty">На этот день всё занято. Выберите другой день в календаре.</p>';
    return;
  }

  slotsCaption.textContent =
    `Свободно ${free} ${pluralize(free, "окно", "окна", "окон")} · время московское`;

  let html = "";

  PERIODS.forEach((period) => {
    const periodSlots = slots.filter((slot) => slot.period === period.id);

    html += '<div class="slots__group">';
    html += `<h3 class="slots__label">${period.title}</h3>`;
    html += '<div class="slots__list">';

    periodSlots.forEach((slot) => {
      if (!slot.available) {
        html += `<button class="slot slot_state_busy" type="button" disabled>${slot.time}</button>`;
        return;
      }
      let classes = "slot";
      if (slot.time === state.selectedTime) classes += " slot_state_selected";
      html += `<button class="${classes}" type="button" data-time="${slot.time}">${slot.time}</button>`;
    });

    html += "</div></div>";
  });

  slotsBody.innerHTML = html;

  slotsBody.querySelectorAll(".slot[data-time]").forEach((button) => {
    button.addEventListener("click", onSlotClick);
  });
}

function onSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderSlots();
  renderSummary();
}

// --- Нижняя панель ---

function renderSummary() {
  const date = state.selectedDate;
  const dayText = `${getWeekdayName(date)}, ${formatDayMonth(date)} ${date.year}`;

  if (state.selectedTime) {
    const end = addMinutes(state.selectedTime, SERVICE.durationMin);
    summaryDate.textContent = `${dayText} • ${state.selectedTime}–${end}`;
    nextStepButton.classList.remove("button_state_disabled");
    nextStepButton.removeAttribute("aria-disabled");
  } else {
    summaryDate.textContent = `${dayText} • выберите время`;
    nextStepButton.classList.add("button_state_disabled");
    nextStepButton.setAttribute("aria-disabled", "true");
  }
}

// Пока время не выбрано, на следующий шаг не пускаем.
function onNextStepClick(event) {
  if (!state.selectedTime) {
    event.preventDefault();
  }
}

// Перерисовать всё, что зависит от состояния.
function render() {
  renderCalendar();
  renderSlots();
  renderSummary();
}

// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ============================================================

prevButton.addEventListener("click", onPrevMonth);
nextButton.addEventListener("click", onNextMonth);
nextStepButton.addEventListener("click", onNextStepClick);

render();
