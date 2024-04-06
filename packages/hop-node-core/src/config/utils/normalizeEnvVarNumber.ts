export function normalizeEnvVarNumber (value?: string): number | undefined {
  if (value !== undefined) {
    return Number(value.toString())
  }
}
