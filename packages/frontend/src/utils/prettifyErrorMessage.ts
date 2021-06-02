const prettifyErrorMessage = (str: string = '') => {
  if (!str) {
    return ''
  }
  return str.replace(/.*\[ethjs-query\].*"message":"(.*)"\}.*/, '$1')
}

export default prettifyErrorMessage
