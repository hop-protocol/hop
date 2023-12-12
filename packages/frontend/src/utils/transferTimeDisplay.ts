import pluralize from 'pluralize'

export function transferTimeDisplay (medianTimeEstimateSeconds: number | null, fixedTimeEstimateSeconds: number | null): string {
  if (medianTimeEstimateSeconds == null && fixedTimeEstimateSeconds == null) {
    return ''
  }

  let seconds = 0
  if (medianTimeEstimateSeconds != null && medianTimeEstimateSeconds > 0) {
    seconds = medianTimeEstimateSeconds
  } else if (fixedTimeEstimateSeconds != null && fixedTimeEstimateSeconds > 0) {
    seconds = fixedTimeEstimateSeconds
  }

  if (!seconds) {
    return ''
  }

  const minutes = Math.round(seconds / 60)
  const isUnderMinute = seconds <= 60
  if (seconds) {
    if (isUnderMinute) {
      return '~1 minute'
    }
    return `${minutes} ${pluralize('minutes', minutes)}`
  }

  return ''
}
