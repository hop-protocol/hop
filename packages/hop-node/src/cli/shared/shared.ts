import Logger from 'src/logger'
import prompt from 'prompt'
import { Command } from 'commander'

prompt.colors = false
export { prompt }

export const logger = new Logger('config')
export const program = new Command()

export function parseArgList (arg: string) {
  return (arg || '')
    .split(',')
    .map((value: string) => value.trim())
    .filter((value: string) => value)
}
