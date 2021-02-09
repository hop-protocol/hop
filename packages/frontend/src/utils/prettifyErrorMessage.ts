const prettifyErrorMessage = (str: string = '') => {
  return str.replace(/.*\[ethjs-query\].*"message":"(.*)\"\}.*/, '$1')
}

export default prettifyErrorMessage
