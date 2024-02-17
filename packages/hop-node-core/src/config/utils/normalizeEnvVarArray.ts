function normalizeEnvVarArray (value?: string): string[] {
  return (value ?? '').split(',').map(x => x.trim()).filter(x => x)
}

export default normalizeEnvVarArray
