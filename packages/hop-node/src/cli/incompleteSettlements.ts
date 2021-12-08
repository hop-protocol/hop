import getIncompleteSettlements from 'src/theGraph/getIncompleteSettlements'
import { Chain } from 'src/constants'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

const chains = [
  Chain.Ethereum,
  Chain.Arbitrum,
  Chain.Optimism,
  Chain.xDai,
  Chain.Polygon
]

program
  .command('incomplete-settlements')
  .description('Get incomplete settlements')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--source-chain <string>', 'Source chain')
  .option('--destination-chain <string>', 'Destination Chain')
  .option('--token <string>', 'Token')
  .option('--all-chains <boolean>', 'Check all destination chains')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const sourceChain = source.sourceChain
      const destinationChain = source.destinationChain
      const token = source.token
      const allChains = source.allChains
      if (!token) {
        throw new Error('token is required')
      }
      if (!sourceChain) {
        throw new Error('source chain is required')
      }
      if (!destinationChain && !allChains) {
        throw new Error('destination chain is required')
      }
      if (destinationChain && allChains) {
        throw new Error('only destinationChain or allChains can be defined')
      }

      const destinationChains = []
      if (allChains) {
        for (const chain of chains) {
          if (chain !== sourceChain) {
            destinationChains.push(chain)
          }
        }
      } else {
        destinationChains.push(destinationChain)
      }

      for (const chain of destinationChains) {
        console.log(`\n\n\nGetting incomplete settlements for token ${token}: source ${sourceChain} and destination ${chain}`)
        const transferRoot = await getIncompleteSettlements(
          token,
          sourceChain,
          chain
        )
        console.log(JSON.stringify(transferRoot, null, 2))
      }
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
