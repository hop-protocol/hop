import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { initConfigs } from '#config/index.js'
import type { Command } from 'commander'

/**
 * Initiation
 */

export async function initCLI (parentCommand: Command, childCommand: Command): Promise<void> {
  const { config, dryRun } = parentCommand.opts()

  // The client name is always the child command name
  const clientName = childCommand.name()
  if (!clientName) {
    throw new Error('Client name not found')
  }

  await initConfigs({
    customConfigPath: config ?? '',
    dryRun: dryRun ?? false,
    clientName
  })
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
