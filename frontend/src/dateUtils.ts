export function getReturnDueDate(now = new Date()) {
  const target = new Date(now.getFullYear(), now.getMonth() + 6, 1)
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate()

  target.setDate(Math.min(now.getDate(), lastDay))

  const year = target.getFullYear()
  const month = String(target.getMonth() + 1).padStart(2, '0')
  const day = String(target.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
