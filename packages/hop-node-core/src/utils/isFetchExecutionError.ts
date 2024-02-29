export function isFetchExecutionError (errMsg: string) {
  const executionErrorRegex = /(The execution failed due to an exception|execution reverted|VM execution error)/i
  return executionErrorRegex.test(errMsg)
}
