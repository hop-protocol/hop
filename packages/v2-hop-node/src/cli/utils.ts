import fs from 'node:fs'
import path from 'node:path'
import { ClientName } from '#clients/index.js'
import { execSync } from 'node:child_process'
import { Config } from '#config/index.js'
import type { Command } from 'commander'

/**
 * Initiation
 */

export async function initCLI (parentCommand: Command): Promise<void> {
  const { config: configPath, dryRun } = parentCommand.opts()

  await Config.init(configPath, dryRun)
  await Config.validateConfig()
}

/**
 * Parsing
 */

export function parseNumber (value: string): number {
  return Number(value)
}

export function parseString (value: string): string {
  return value
}

export function parseStringArray (value: string): string[] {
  return value.trim().split(',').map((v: string) => v.trim())
}

export function parseBool (value: string): boolean {
  return value !== 'false'
}

export function parseInputFileList (value: string): string[] | null {
  if (value) {
    const data = fs.readFileSync(path.resolve(value), 'utf8')
    if (value.endsWith('.json')) {
      try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          return parsed
        }
        throw new Error('Data must be an Array')
      } catch (err) {
        throw new Error(`Invalid json file. Error: ${err.message}`)
      }
    }

    const list = data.split('\n').map(x => x.trim()).filter((x: any) => x)
    return list
  }
  return null
}

/**
 * Other
 */

export const getGitRevision = (): string => {
  return process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString().trim()
}

export const getHelpTextBefore = (art: string): string => {
  const version = getGitRevision()
  return `
${art}

Version: ${version}
  `
}

export const getClientNameFromCommand = (command: Command): ClientName => {
  // The client name is the first argument of the root command, so loop
  // through the parent commands until the root command is found.
  let currentCommand: Command | undefined = command
  while (currentCommand.parent) {
    currentCommand = currentCommand.parent
  }

  const clientName = currentCommand.args[0]
  if (!clientName) {
    throw new Error('Client name not found')
  }

  const validClientNames = Object.values(ClientName)
  if (!validClientNames.includes(clientName as ClientName)) {
    throw new Error(`Invalid client name: ${clientName}`)
  }

  return clientName as ClientName
}
