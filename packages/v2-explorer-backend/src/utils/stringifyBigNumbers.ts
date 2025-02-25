import { BigNumber } from 'ethers'

export function stringifyBigNumbers(obj: any): any {
  if (!obj) {
    return obj
  }

  const processObject = (input: any): any => {
    if (BigNumber.isBigNumber(input)) {
      // If the value is a BigNumber, convert it to a string
      return input.toString()
    } else if (Array.isArray(input)) {
      // If the input is an array, process each element
      return input.map(processObject)
    } else if (input && typeof input === "object" && input.constructor === Object) {
      // If the input is a plain object, process each key-value pair
      return Object.entries(input).reduce((acc: any, [key, value]) => {
        acc[key] = processObject(value)
        return acc
      }, {})
    }

    // Return the value as-is for primitives or unrecognized types
    return input
  }

  return processObject(obj)
}
