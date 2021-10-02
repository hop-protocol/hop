import ContractStateWatcher, { Contracts } from 'src/watchers/ContractStateWatcher'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

import { logger, program } from './shared'

program
  .command('contract-state')
  .description('Print contract state')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--token <string>', 'Token symbol')
  .option('--l1bridge', 'Show L1 Bridge state')
  .option('--l2bridge', 'Show L2 Bridge state')
  .option('--l2amm', 'Show L2 AMM state')
  .option('--l2ammwrapper', 'Show L2 AMM wrapper state')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const token = source.token
      if (!token) {
        throw new Error('token is required')
      }
      const contracts: string[] = []
      if (source.l1bridge) {
        contracts.push(Contracts.L1Bridge)
      }
      if (source.l2bridge) {
        contracts.push(Contracts.L2Bridge)
      }
      if (source.l2amm) {
        contracts.push(Contracts.L2Amm)
      }
      if (source.l2ammwrapper) {
        contracts.push(Contracts.L2AmmWrapper)
      }
      const watcher = new ContractStateWatcher({
        token,
        contracts
      })

      console.log('fetching state for contracts')
      const state = await watcher.getState()
      console.log(JSON.stringify(state, null, 2))

      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
