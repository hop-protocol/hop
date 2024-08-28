export function truncateString (str: string, splitNum: number = 2) {
  if (!str) return ''

  // If the string is shorter than or equal to the truncation length, return it as is
  if (str.length <= 2 + splitNum + splitNum) {
    return str
  }

  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}
