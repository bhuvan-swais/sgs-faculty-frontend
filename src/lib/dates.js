/**
 * Date helpers for form inputs.
 *
 * `todayISO()` is the value a <input type="date"> expects for "today" in the
 * user's own timezone. Don't use `new Date().toISOString().slice(0, 10)` for
 * this — that is UTC, and in India it is still yesterday until 05:30 IST.
 */

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
