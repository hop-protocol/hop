export const prettifyErrorMessage = (str: string = ''): string => {
  if (!str) {
    return ''
  }
  return str.replace(/.*\[ethjs-query\].*"message":"(.*)"\}.*/, '$1')
}
