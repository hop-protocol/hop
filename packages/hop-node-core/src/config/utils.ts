import fs from 'node:fs'
import path from 'node:path'
import minimist from 'minimist'

export function getEnvFilePath (): string {
  const defaultEnvFilePath = path.resolve(process.cwd(), '.env')

  const argv = minimist(process.argv.slice(2))
  if (typeof argv.env !== 'string') {
    return defaultEnvFilePath
  }

  const envFilePath = path.resolve(argv.env)
  if (!fs.existsSync(envFilePath)) {
    console.error(`env file '${envFilePath}' does not exit`)
    process.exit(1)
  }

  return envFilePath ?? defaultEnvFilePath
}

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
