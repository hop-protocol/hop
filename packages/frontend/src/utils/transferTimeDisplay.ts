import pluralize from 'pluralize'

export function transferTimeDisplay(medianTimeEstimateSeconds: number | null, fixedTimeEstimateSeconds: number | null): string {
  // Determine the valid time estimate or default to 0
  let seconds = 0;
  if (medianTimeEstimateSeconds != null && medianTimeEstimateSeconds > 0) {
    seconds = medianTimeEstimateSeconds;
  } else if (fixedTimeEstimateSeconds != null && fixedTimeEstimateSeconds > 0) {
    seconds = fixedTimeEstimateSeconds;
  }

  // Return empty string for no time or zero seconds
  if (!seconds) {
    return ''
  }

  // For under one minute, return '~1 minute'
  if (seconds <= 60) {
    return '~1 minute'
  }

  // Calculate and return pluralized minutes
  const minutes = Math.round(seconds / 60)
  return `${minutes} ${pluralize('minutes', minutes)}`
}
