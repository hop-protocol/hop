import pluralize from 'pluralize'

export function transferTimeDisplay(medianTimeEstimate, fixedTimeEstimate): string {
  return (
    medianTimeEstimate !== null && medianTimeEstimate > 0) 
      ? (medianTimeEstimate + " " + `${pluralize('minute', medianTimeEstimate)}`) 
      : (fixedTimeEstimate + " " + pluralize('minute', fixedTimeEstimate)
  )
}
