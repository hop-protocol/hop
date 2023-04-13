export function isExecutionError (errMsg: string) {
  const regex = /(The execution failed due to an exception|execution reverted|VM execution error)/i
  return regex.test(errMsg)
}
