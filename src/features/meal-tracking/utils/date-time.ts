/** Formats an instant as the local wall-clock value required by datetime-local. */
export function toLocalDateTime(value: string | Date = new Date()) {
  const date = typeof value === "string" ? new Date(value) : value
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
