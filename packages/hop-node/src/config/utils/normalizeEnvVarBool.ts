function normalizeEnvVarBool (value?: string): boolean | undefined {
  if (!value) return

  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false

  throw new Error(`Invalid boolean value: ${value}`)
}

export default normalizeEnvVarBool
