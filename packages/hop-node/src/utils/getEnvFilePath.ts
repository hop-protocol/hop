import fs from 'node:fs'
import path from 'node:path'
import minimist from 'minimist'

export function getEnvFilePath (): string | undefined {
  const argv = minimist(process.argv.slice(2))
  if (typeof argv.env !== 'string') {
    return
  }

  const envFilePath = path.resolve(argv.env)
  if (!fs.existsSync(envFilePath)) {
    console.error(`env file '${envFilePath}' does not exit`)
    process.exit(1)
  }

  return envFilePath
}