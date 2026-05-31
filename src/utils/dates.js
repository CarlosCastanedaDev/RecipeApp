// Local-date helpers (avoid UTC drift from toISOString).

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

// Array of `count` Date objects starting today (local midnight).
export function upcomingDays(count = 14) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: count }, (_, i) => addDays(today, i))
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatDay(date) {
  return {
    weekday: WEEKDAY[date.getDay()],
    day: date.getDate(),
    month: MONTH[date.getMonth()],
    isToday: toKey(date) === toKey(new Date()),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
  }
}
