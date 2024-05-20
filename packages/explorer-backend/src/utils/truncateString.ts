export function truncateString (str: string, splitNum: number) {
  if (!str) return ''
  if (str.length < splitNum * 2) {
    return str
  }
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}
