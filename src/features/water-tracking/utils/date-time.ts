interface DateTimeParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function formatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
}

function partsAt(instant: number, timeZone: string): DateTimeParts {
  const values = Object.fromEntries(formatter(timeZone).formatToParts(instant).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, Number(value)]))
  return { year: values.year, month: values.month, day: values.day, hour: values.hour, minute: values.minute, second: values.second }
}

function utcLike(parts: DateTimeParts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

export function isValidTimeZone(timeZone: string) {
  try { formatter(timeZone); return true } catch { return false }
}

export function localDateTimeToUtc(localDateTime: string, timeZone: string) {
  if (!isValidTimeZone(timeZone)) throw new Error("Invalid timezone")
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(localDateTime)
  if (!match) throw new Error("Invalid local date and time")
  const target: DateTimeParts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] ?? 0) }
  let instant = utcLike(target)
  for (let index = 0; index < 4; index += 1) instant += utcLike(target) - utcLike(partsAt(instant, timeZone))
  const resolved = partsAt(instant, timeZone)
  if (utcLike(resolved) !== utcLike(target)) throw new Error("Local time does not exist in this timezone")
  return new Date(instant).toISOString()
}

export function selectedDayUtcRange(date: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + 1))
  const nextDate = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`
  return {
    startUtc: localDateTimeToUtc(`${date}T00:00:00`, timeZone),
    endUtc: localDateTimeToUtc(`${nextDate}T00:00:00`, timeZone),
  }
}

export function toZonedLocalDateTime(isoDate: string, timeZone: string) {
  const parts = partsAt(new Date(isoDate).getTime(), timeZone)
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`
}
