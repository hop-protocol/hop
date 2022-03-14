import dayjs from 'dayjs'

const oneMinMs = 60 * 1000
const oneHourMs = oneMinMs * 60

export function isOlderThanOneHour(timestamp: number) {
  const now = dayjs()
  const oneHourAgo = now.subtract(oneHourMs)
  return oneHourAgo.isAfter(timestamp)
}

export const defaultRefetchInterval = 10e3
