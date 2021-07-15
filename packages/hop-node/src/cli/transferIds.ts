import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { logger, program } from './shared'

import getTransfer from 'src/theGraph/getTransfer'
import getTransferIds from 'src/theGraph/getTransferIds'
import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'

program
  .command('transfer-ids')
  .description('Get recent transfer IDs or transfer IDs for transfer root hash')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--info', 'Show transfer ID info')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const transferRootHash = source.args[0]
      const showInfo = source.info
      const chain = source.chain
      if (!chain) {
        throw new Error('chain is required')
      }
      if (transferRootHash) {
        const transferIds = await getTransferIdsForTransferRoot(
          chain,
          transferRootHash
        )
        console.log(JSON.stringify(transferIds.map((x: any) => {
          if (showInfo) {
            return x
          }
          return x.transferId
        }), null, 2))
      } else {
        const transferIds = await getTransferIds(
          chain
        )
        if (showInfo) {
          for (const { transferId } of transferIds) {
            const transfer = await getTransfer(chain, transferId)
            console.log(JSON.stringify(transfer, null, 2))
          }
        } else {
          console.log(JSON.stringify(transferIds.map((x: any) => {
            return x.transferId
          }), null, 2))
        }
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
