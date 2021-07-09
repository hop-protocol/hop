import os from 'os'
import prompt from 'prompt'
import yaml from 'js-yaml'
import { Command } from 'commander'
import { Chain } from 'src/constants'
import Logger, { setLogLevel } from 'src/logger'
import { Config } from './config'
import { generateKeystore, recoverKeystore } from 'src/keystore'
import { getParameter } from 'src/aws/parameterStore'
import {
  config as globalConfig,
  db as dbConfig,
  setConfigByNetwork,
  setBonderPrivateKey,
  setNetworkRpcUrls,
  setNetworkWaitConfirmations,
  setSyncConfig,
  slackAuthToken,
  slackChannel,
  slackUsername
} from 'src/config'

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
