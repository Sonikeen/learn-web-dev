// Данные страницы. Сервера пока нет — всё захардкожено.
import { dateKey } from "../utils/date.js";

// «Сегодня» зафиксировано, чтобы страница совпадала с макетом
// и проверка не зависела от того, в какой день её открыли.
export const TODAY = { year: 2026, month: 9, day: 23 };

// День, который выбран при открытии страницы (как в макете).
export const DEFAULT_DATE = { year: 2026, month: 9, day: 28 };

export const MASTER = "Дмитрий Орлов";

export const SERVICE = {
  title: "Мужская стрижка",
  price: "2 200 ₽",
  durationMin: 60,
};

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

export const PERIODS = [
  { id: "morning", title: "Утро" },
  { id: "day", title: "День" },
  { id: "evening", title: "Вечер" },
];

// Занятое время по конкретным датам. "all" — весь день занят.
// Для остальных дат занятость считается по формуле в getSlotsForDate.
const BUSY_TIMES = {
  "2026-10-23": ["10:00", "10:30", "11:00", "12:00", "15:00"],
  "2026-10-24": ["12:00", "13:00", "14:00", "18:00", "19:00"],
  "2026-10-25": "all",
  "2026-10-28": ["11:00", "13:00", "17:00", "20:00"],
  "2026-10-31": "all",
  "2026-11-07": "all",
  "2026-11-15": "all",
};

// Слоты на конкретный день: [{ time, period, available }].
export function getSlotsForDate(date) {
  const busy = BUSY_TIMES[dateKey(date)];

  return TIME_SLOTS.map((slot, index) => {
    let available;
    if (busy === "all") {
      available = false;
    } else if (Array.isArray(busy)) {
      available = !busy.includes(slot.time);
    } else {
      // «Случайная», но всегда одинаковая занятость для дня.
      available = (date.day * 3 + index) % 4 !== 0;
    }
    return { ...slot, available };
  });
}

export function countFreeSlots(slots) {
  return slots.filter((slot) => slot.available).length;
}
