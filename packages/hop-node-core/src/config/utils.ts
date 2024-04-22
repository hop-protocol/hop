export function normalizeEnvVarNumber (value?: string): number | undefined {
  if (value !== undefined) {
    return Number(value.toString())
  }
}

export function normalizeEnvVarBool (value?: string): boolean | undefined {
  if (!value) return

  if (typeof value === 'boolean') return value
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false

  throw new Error(`Invalid boolean value: ${value}`)
}

export function normalizeEnvVarArray (value?: string): string[] {
  return (value ?? '').split(',').map(x => x.trim()).filter(x => x)
}
