// Month calendar used for booking a mentor and for a mentor's days off / special hours.
import { addMonths, longDate, monthEnd, monthStart, ymd } from "./bookingUtils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Props
 *   month          first day of the month shown (Date)
 *   onMonthChange  (Date) => void
 *   value          selected date "YYYY-MM-DD" or null
 *   onChange       ("YYYY-MM-DD") => void
 *   minDate/maxDate "YYYY-MM-DD" limits (inclusive)
 *   isEnabled      (dateStr) => boolean   extra rule, e.g. "has free slots"
 *   marks          { "YYYY-MM-DD": "available" | "closed" | "custom" }  small dot under the day
 *   loading        dims the grid while data for the month loads
 */
export default function MiniCalendar({
  month, onMonthChange, value, onChange, minDate, maxDate, isEnabled, marks = {}, loading = false, label = "Choose a date",
}) {
  const first = monthStart(month);
  const lead = (first.getDay() + 6) % 7; // Monday-first grid
  const days = monthEnd(month).getDate();
  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let d = 1; d <= days; d += 1) cells.push(new Date(first.getFullYear(), first.getMonth(), d));
  while (cells.length % 7) cells.push(null);

  const today = ymd(new Date());
  const canPrev = !minDate || ymd(monthEnd(addMonths(first, -1))) >= minDate;
  const canNext = !maxDate || ymd(addMonths(first, 1)) <= maxDate;

  return (
    <div className={`mb-cal${loading ? " is-loading" : ""}`}>
      <div className="mb-cal-head">
        <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => onMonthChange(addMonths(first, -1))}>
          <i className="bi bi-chevron-left" />
        </button>
        <b aria-live="polite">{first.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</b>
        <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => onMonthChange(addMonths(first, 1))}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
      <div className="mb-cal-grid" role="grid" aria-label={label}>
        {WEEKDAYS.map((w) => <span key={w} className="mb-cal-dow" role="columnheader">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} aria-hidden="true" />;
          const key = ymd(d);
          const outOfRange = (minDate && key < minDate) || (maxDate && key > maxDate);
          const enabled = !outOfRange && (isEnabled ? isEnabled(key) : true);
          const selected = value === key;
          const mark = marks[key];
          return (
            <button
              type="button"
              key={key}
              role="gridcell"
              aria-selected={selected}
              aria-label={`${longDate(key)}${enabled ? "" : ", not available"}`}
              disabled={!enabled}
              className={[selected && "selected", key === today && "today", mark && `mark-${mark}`].filter(Boolean).join(" ")}
              onClick={() => onChange(key)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
