export function nearestDate (dates: any[], target: any) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  var nearest = Infinity
  var winner = -1

  dates.forEach(function (date, index) {
    if (date instanceof Date) date = date.getTime()
    var distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
  })

  return winner
}
