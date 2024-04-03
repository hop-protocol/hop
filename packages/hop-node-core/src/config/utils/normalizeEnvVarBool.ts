export function normalizeEnvVarBool (value?: string): boolean | undefined {
  if (!value) return

  if (typeof value === 'boolean') return value
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false

  throw new Error(`Invalid boolean value: ${value}`)
}
