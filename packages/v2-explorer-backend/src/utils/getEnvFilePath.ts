import fs from 'node:fs'
import minimist from 'minimist'
import path from 'node:path'

export function getEnvFilePath (): string | undefined {
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