import stringify from 'json-stable-stringify'

// Helper function to recursively sort arrays of objects
function sortNestedArrays(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortNestedArrays).sort((a, b) => {
      if (typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a).localeCompare(JSON.stringify(b))
      }
      return 0
    })
  } else if (obj !== null && typeof obj === 'object') {
    const sortedObj: Record<string, any> = {}
    Object.keys(obj).sort().forEach(key => {
      sortedObj[key] = sortNestedArrays(obj[key])
    })
    return sortedObj
  }
  return obj
}

// Generalized function to stringify objects deterministically
export function deterministicStringify(obj: any): string {
  const sortedObj = sortNestedArrays(obj)
  return stringify(sortedObj)
}
