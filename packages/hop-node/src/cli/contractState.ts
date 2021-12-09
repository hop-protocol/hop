import ContractStateWatcher, { Contracts } from 'src/watchers/ContractStateWatcher'

import { actionHandler, parseBool, parseString, root } from './shared'

root
  .command('contract-state')
  .description('Print contract state')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--l1bridge', 'Show L1 Bridge state', parseBool)
  .option('--l2bridge', 'Show L2 Bridge state', parseBool)
  .option('--l2amm', 'Show L2 AMM state', parseBool)
  .option('--l2ammwrapper', 'Show L2 AMM wrapper state', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { token, l1bridge, l2bridge, l2amm, l2ammwrapper } = source
  if (!token) {
    throw new Error('token is required')
  }
  const contracts: string[] = []
  if (l1bridge) {
    contracts.push(Contracts.L1Bridge)
  }
  if (l2bridge) {
    contracts.push(Contracts.L2Bridge)
  }
  if (l2amm) {
    contracts.push(Contracts.L2Amm)
  }
  if (l2ammwrapper) {
    contracts.push(Contracts.L2AmmWrapper)
  }
  const watcher = new ContractStateWatcher({
    token,
    contracts
  })

  console.log('fetching state for contracts')
  const state = await watcher.getState()
  console.log(JSON.stringify(state, null, 2))
}
