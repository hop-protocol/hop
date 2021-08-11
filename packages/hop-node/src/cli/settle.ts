import {
  FileConfig,
  parseConfigFile,
  setConfigByNetwork
  ,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('settle')
  .description('Settle bonded withdrawals')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('--transfer-id <string>', 'Transfer ID')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      // dbConfig.path = '/home/mota/.hop-node/db.mainnet'
      const network = source.network
      const chain = source.chain
      const token = source.token
      const transferId = source.transferId

      setConfigByNetwork(network)
      logger.info('network:', network)

      if (!network) {
        throw new Error(
          'network is required. Options are: kovan, goerli, mainnet'
        )
      }
      if (!chain) {
        throw new Error(
          'chain is required. Options are: ethereum, xdai, polygon, optimism, arbitrum'
        )
      }
      if (!token) {
        throw new Error(
          'token is required: Options are: USDC, DAI, etc... Use correct capitalization.'
        )
      }

      /*
      const { stop, watchers } = await startWatchers({
        order: 0,
        tokens: [token],
        networks: ['xdai', 'polygon'],
        enabledWatchers: ['settleBondedWithdrawals'],
        bonder: true,
        challenger: false,
        maxStakeAmounts: {},
        commitTransfersMinThresholdAmounts: 0,
        bondWithdrawalAmounts: 0,
        settleBondedWithdrawalsThresholdPercent: 0,
        dryMode: false
      })

      const watcher = watchers[0].getSiblingWatcherByChainSlug(Chain.xDai)
      const transfers = await db.transfers.getTransfers()
      console.log(transfers)
      const root = await db.transferRoots.getByTransferRootHash('0x7c247a2043b9d4973a139428fe242652d568cecc9fb4c6fd0d4490b16c561c3f')
      console.log('root', root)
      await db.transfers.update(transferId, {
        transferRootId: null,
        transferRootHash: null
      })
      const transfer = await db.transfers.getByTransferId(transferId)
      console.log(transfer)
      await watcher.checkUnsettledTransfer(transfer)
      */

      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
