export const filterObjectProperties = <T extends Record<string, unknown>> (
  obj: T | object,
  keys: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {}

  keys.forEach(key => {
    const value = (obj as T)[key]
    if (value === undefined || value === null) {
      throw new Error(`Missing index key: ${String(key)}`)
    }
    result[key] = value
  })

  return result
}
