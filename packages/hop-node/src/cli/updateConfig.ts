import fs from 'fs'
import normalizeEnvVarArray from 'src/config/utils/normalizeEnvVarArray'
import objectDepth from 'src/utils/objectDepth'
import path from 'path'
import {
  FileConfig,
  getEnabledNetworks,
  isValidChain,
  isValidToken,
  writeConfigFile
} from 'src/config'
import { actionHandler, logger, parseBool, parseString, root } from './shared'

root
  .command('update-config')
  .description('Update config file')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--destination-chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--tokens <symbols>', 'Specifiy multiple token symbol', parseString)
  .option('--set-enabled [boolean]', 'Token to set enabled/disabled', parseBool)
  .option('--commit-transfers-min-threshold [amount]', 'Min threshold amount for committing transfers', parseString)
  .option('--from-file <path>', 'Update config with input from file', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { config, configFilePath, chain, destinationChain, fromFile, setEnabled } = source
  const tokens = normalizeEnvVarArray(source.tokens || source.token)
  const commitTransfersMinThresholdAmount = Number(source.commitTransfersMinThreshold || 0)

  const newConfig = JSON.parse(JSON.stringify(config)) as FileConfig // deep clone
  const oldConfig = JSON.parse(JSON.stringify(config)) as FileConfig // deep clone

  if (source.commitTransfersMinThreshold !== undefined) {
    const updateCommitTransfersMinThreshold = async (token: string) => {
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!isValidChain(chain)) {
        throw new Error('chain is invalid')
      }
      if (!destinationChain) {
        logger.warn('destination chain not specified; will configure for all chains')
      }
      if (destinationChain && !isValidChain(destinationChain)) {
        throw new Error('destination chain is invalid')
      }
      if (!token) {
        throw new Error('token is required')
      }
      if (!isValidToken(token)) {
        throw new Error('token is invalid')
      }
      if (!(newConfig.commitTransfers instanceof Object)) {
        newConfig.commitTransfers = {
          minThresholdAmount: {}
        }
      }
      if (!(newConfig.commitTransfers.minThresholdAmount instanceof Object)) {
        newConfig.commitTransfers.minThresholdAmount = {}
      }
      if (!(newConfig.commitTransfers.minThresholdAmount[token] instanceof Object)) {
        newConfig.commitTransfers.minThresholdAmount[token] = {}
      }
      if (!(newConfig.commitTransfers.minThresholdAmount[token][chain] instanceof Object)) {
        newConfig.commitTransfers.minThresholdAmount[token][chain] = {}
      }
      if (destinationChain) {
        if (!(newConfig.commitTransfers.minThresholdAmount[token][chain][destinationChain] instanceof Object)) {
          newConfig.commitTransfers.minThresholdAmount[token][chain][destinationChain] = {}
        }
      }

      const depth = objectDepth(oldConfig.commitTransfers)
      const isV1ConfigType = depth < 3
      const isV2ConfigType = depth < 4
      const allChains = getEnabledNetworks()

      // convert old config type to new config type
      if (isV1ConfigType || isV2ConfigType) {
        if (oldConfig.commitTransfers?.minThresholdAmount) {
          for (const _chain in oldConfig.commitTransfers.minThresholdAmount) {
            if (!isValidChain(_chain)) {
              continue
            }
            for (const _token in oldConfig.commitTransfers.minThresholdAmount[_chain]) {
              if (!isValidToken(_token)) {
                continue
              }
              for (const _destinationChain of allChains) {
                if (!newConfig.commitTransfers.minThresholdAmount[_token]) {
                  newConfig.commitTransfers.minThresholdAmount[_token] = {}
                }
                if (!newConfig.commitTransfers.minThresholdAmount[_token][_chain]) {
                  newConfig.commitTransfers.minThresholdAmount[_token][_chain] = {}
                }
                if (oldConfig.commitTransfers.minThresholdAmount[_chain][_token]) {
                  newConfig.commitTransfers.minThresholdAmount[_token][_chain][_destinationChain] = oldConfig.commitTransfers.minThresholdAmount[_chain][_token]
                }
              }
            }
          }
        }
      }

      if (isV1ConfigType || isV2ConfigType) {
        for (const _token in newConfig.commitTransfers.minThresholdAmount) {
          if (typeof newConfig.commitTransfers.minThresholdAmount[_token] === 'number') {
            delete newConfig.commitTransfers.minThresholdAmount[_token]
          }

          for (const _chain in newConfig.commitTransfers.minThresholdAmount) {
            if (typeof newConfig.commitTransfers.minThresholdAmount[_chain]?.[_token] === 'number') {
              delete newConfig.commitTransfers.minThresholdAmount[_chain]
            }
          }
        }
      }

      const destinationChains = destinationChain ? [destinationChain] : allChains
      for (const _destinationChain of destinationChains) {
        newConfig.commitTransfers.minThresholdAmount[token][chain][_destinationChain] = commitTransfersMinThresholdAmount
        logger.debug(`updating commitTransfers.minThresholdAmount ${token} ${chain}→${_destinationChain} ${commitTransfersMinThresholdAmount}`)
      }
    }

    if (fromFile) {
      let json: any
      try {
        const filepath = path.resolve(fromFile)
        if (!fs.existsSync(filepath)) {
          throw new Error(`file ${filepath} does not exist`)
        }
        json = JSON.parse(fs.readFileSync(filepath, 'utf8').trim())
      } catch (err) {
        throw new Error('could not parse JSON input file')
      }

      if (!(newConfig.commitTransfers instanceof Object)) {
        newConfig.commitTransfers = {
          minThresholdAmount: {}
        }
      }
      newConfig.commitTransfers.minThresholdAmount = json
      for (const _token in json) {
        for (const _sourceChain in json[_token]) {
          for (const _destinationChain in json[_token][_sourceChain]) {
            const amount = json[_token][_sourceChain][_destinationChain]
            logger.debug(`updating commitTransfers.minThresholdAmount ${_token} ${_sourceChain}→${_destinationChain} ${amount} `)
          }
        }
      }
    } else {
      for (const token of tokens) {
        await updateCommitTransfersMinThreshold(token)
      }
    }
  } else if (setEnabled) {
    const updateEnabled = async (token: string) => {
      if (!token) {
        throw new Error('token is required')
      }
      if (!(newConfig.tokens instanceof Object)) {
        newConfig.tokens = {}
      }
      newConfig.tokens[token] = setEnabled
      logger.debug(`updating ${token} as ${setEnabled ? 'enabled' : 'disabled'}`)
    }

    for (const token of tokens) {
      await updateEnabled(token)
    }
  } else {
    throw new Error('action is required')
  }

  await writeConfigFile(newConfig, configFilePath)
}
