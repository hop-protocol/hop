import fs from 'fs'
import normalizeEnvVarArray from 'src/config/utils/normalizeEnvVarArray'
import objectDepth from 'src/utils/objectDepth'
import path from 'path'
import {
  FileConfig,
  getEnabledNetworks,
  isValidNetwork,
  isValidToken,
  parseConfigFile,
  setGlobalConfigFromConfigFile,
  writeConfigFile
} from 'src/config'
import { getAddress } from 'ethers/lib/utils'
import { logger, program } from './shared'

program
  .command('update-config')
  .description('Update config file')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--destination-chain <string>', 'Destination chain')
  .option('--token <string>', 'Token symbol')
  .option('--tokens <string>', 'Specifiy multiple token symbol')
  .option('--set-enabled [boolean]', 'Token to set enabled/disabled')
  .option('--commit-transfers-min-threshold [string]', 'Min threshold amount for committing transfers')
  .option('--state-update-address <string>', 'Address of StateUpdater contract')
  .option('--from-file <string>', 'Update config with input from file')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      const config = await parseConfigFile(configPath)
      if (configPath) {
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const destinationChain = source.destinationChain
      const tokens = normalizeEnvVarArray(source.tokens || source.token)
      const commitTransfersMinThresholdAmount = Number(source.commitTransfersMinThreshold || 0)

      const newConfig = JSON.parse(JSON.stringify(config)) as FileConfig // deep clone
      const oldConfig = JSON.parse(JSON.stringify(config)) as FileConfig // deep clone

      if (source.commitTransfersMinThreshold !== undefined) {
        const updateCommitTransfersMinThreshold = async (token: string) => {
          if (!chain) {
            throw new Error('chain is required')
          }
          if (!isValidNetwork(chain)) {
            throw new Error('chain is invalid')
          }
          if (!destinationChain) {
            logger.warn('destination chain not specified; will configure for all chains')
          }
          if (destinationChain && !isValidNetwork(destinationChain)) {
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
                if (!isValidNetwork(_chain)) {
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

        if (source.fromFile) {
          let json: any
          try {
            const filepath = path.resolve(source.fromFile)
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
      } else if (source.setEnabled) {
        const updateEnabled = async (token: string) => {
          let setEnabled = !!source.setEnabled
          if (typeof source.setEnabled === 'string') {
            setEnabled = source.setEnabled !== 'false'
          }
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
      } else if (source.stateUpdateAddress) {
        const stateUpdateAddress = getAddress(source.stateUpdateAddress)
        newConfig.stateUpdateAddress = stateUpdateAddress
        logger.debug(`updating StateUpdate address to ${stateUpdateAddress}`)
      } else {
        throw new Error('action is required')
      }

      await writeConfigFile(newConfig, configPath)

      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
