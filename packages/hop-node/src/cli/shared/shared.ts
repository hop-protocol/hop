import { Logger } from '@hop-protocol/hop-node-core/logger'
import fs from 'node:fs'
import path from 'node:path'
import { BigNumber } from 'ethers'
import { Command } from 'commander'
import { WithdrawalProofData, getWithdrawalProofData } from 'src/utils/getWithdrawalProofData.js'
import {
  config as globalConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile,
  validateConfigFileStructure,
  validateConfigValues
} from 'src/config/index.js'

export const logger = new Logger('config')
export const program = new Command()

export const root = program
  .option(
    '--config <path>',
    'Config file path to use. Config file must be in JSON format',
    parseString
  )
  .option('--env <path>', 'Environment variables file', parseString)

export function actionHandler (fn: (source: any) => any) {
  return async (source: any = {}) => {
    try {
      const configFilePath = source.config || source?.parent?.config
      if (configFilePath) {
        const config = await parseConfigFile(configFilePath)
        await setGlobalConfigFromConfigFile(config, source.passwordFile)
        await validateConfigFileStructure(config)
        source.configFilePath = configFilePath
        source.config = config
      }

      if (source?.dry === undefined && source?.parent?.dry) {
        source.dry = source?.parent?.dry
      }

      await validateConfigValues(globalConfig)

      await fn(source)
      process.exit(0)
    } catch (err) {
      logger.error(`program error: ${err.message}\ntrace: ${err.stack}`)
      process.exit(1)
    }
  }
}

export function parseNumber (value: string) {
  return Number(value)
}

export function parseString (value: string) {
  return value ?? ''
}

export function parseStringArray (value: string) {
  return (value ?? '').trim().split(',').map((v: string) => v.trim())
}

export function parseBool (value: string) {
  return value !== 'false'
}

export function parseInputFileList (value: string) {
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

export function getWithdrawalProofDataForCli (
  transferId: string,
  dbTransferRoot: any
): WithdrawalProofData {
  const rootTotalAmount: BigNumber = dbTransferRoot.totalAmount
  const transferIds: string[] = dbTransferRoot.transferIds?.map((x: any) => x.transferId)
  if (!transferIds?.length) {
    throw new Error('expected transfer ids for transfer root hash')
  }

  return getWithdrawalProofData(transferId, rootTotalAmount, transferIds)
}
