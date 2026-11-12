// SVG-иконки из макета. Цвет берётся из CSS через currentColor.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function ScissorsIcon({ className, size = 20 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" strokeWidth="1.67" {...base}>
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="5" cy="15" r="2.5" />
      <path d="M16.67 3.33 6.77 13.23M12.06 12.07l4.6 4.6M6.77 6.77 10 10" />
    </svg>
  );
}

export function PhoneIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" {...base}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ChevronIcon({ className, direction = "right", size = 18 }) {
  const d = direction === "right" ? "M6.75 13.5 11.25 9l-4.5-4.5" : "M11.25 13.5 6.75 9l4.5-4.5";
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" strokeWidth="1.5" {...base}>
      <path d={d} />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth="2" {...base}>
      <path d="M13.33 4 6 11.33 2.67 8" />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" strokeWidth="1.17" {...base}>
      <path d="M11.67 12.25v-1.17a2.33 2.33 0 0 0-2.34-2.33H4.67a2.33 2.33 0 0 0-2.34 2.33v1.17" />
      <circle cx="7" cy="4.08" r="2.33" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" strokeWidth="1.5" {...base}>
      <rect x="1.5" y="1.5" width="15" height="15" rx="3.75" />
      <circle cx="9" cy="9" r="3" />
      <path d="M13.13 4.88h.01" />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" strokeWidth="1.5" {...base}>
      <path d="M16.5 1.5 8.25 9.75M16.5 1.5l-5.25 15-3-6.75-6.75-3 15-5.25z" />
    </svg>
  );
}

export function MessageIcon({ className, size = 18 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" strokeWidth="1.5" {...base}>
      <path d="M15.75 11.25a1.5 1.5 0 0 1-1.5 1.5h-9l-3 3v-12a1.5 1.5 0 0 1 1.5-1.5h10.5a1.5 1.5 0 0 1 1.5 1.5z" />
    </svg>
  );
}

export function PinIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" strokeWidth="1.33" {...base}>
      <path d="M14 6.67c0 4.66-6 8.66-6 8.66s-6-4-6-8.66a6 6 0 0 1 12 0z" />
      <circle cx="8" cy="6.67" r="2" />
    </svg>
  );
}

export function ClockIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" strokeWidth="1.33" {...base}>
      <circle cx="8" cy="8" r="6.67" />
      <path d="M8 4v4l2.67 1.33" />
    </svg>
  );
}
