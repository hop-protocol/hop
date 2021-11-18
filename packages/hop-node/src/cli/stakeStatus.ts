import { logger, program } from './shared'
import { constants } from 'ethers'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import { Chain } from 'src/constants'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

async function printAmounts (bridge: L2Bridge | L1Bridge) {
  const bonderAddress = await bridge.getBonderAddress()
  logger.debug(`bonder address: ${bonderAddress}`)

  const [credit, rawDebit, debit, allowance, eth] = await Promise.all([
    bridge.getCredit(),
    bridge.getRawDebit(),
    bridge.getDebit(),
    getTokenAllowance(bridge),
    bridge.getEthBalance()
  ])

  const token = await getToken(bridge)
  let balance
  if (token) {
    balance = await token!.getBalance()
  }
  logger.debug('eth balance:', bridge.formatEth(eth))
  logger.debug('token balance:', balance && bridge.formatUnits(balance))
  logger.debug('credit balance:', bridge.formatUnits(credit))
  logger.debug('raw debit balance:', bridge.formatUnits(rawDebit))
  logger.debug('debit balance:', bridge.formatUnits(debit))
  logger.debug('allowance:', bridge.formatUnits(allowance))
}

async function getToken (bridge: L2Bridge | L1Bridge): Promise<Token | void> {
  const isEthSend: boolean = bridge.l1CanonicalTokenAddress === constants.AddressZero
  if (isEthSend) {
    return
  } else if (bridge.chainSlug !== Chain.Ethereum) {
    return (bridge as L2Bridge).hToken()
  }
  return (bridge as L1Bridge).l1CanonicalToken()
}

async function getTokenAllowance (bridge: L2Bridge | L1Bridge) {
  if (bridge.tokenSymbol === 'ETH') {
    return constants.MaxUint256
  }
  const spender: string = bridge.getAddress()
  const token = await getToken(bridge)
  return await token!.getAllowance(spender)
}

program
  .command('stake-status')
  .description('Stake status')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token

      // Arbitrary watcher since only the bridge is needed
      const watchers = await getWatchers({
        enabledWatchers: ['bondWithdrawal'],
        tokens: [token],
        dryMode: false
      })

      const watcher = findWatcher(watchers, BondWithdrawalWatcher, chain) as BondWithdrawalWatcher
      if (!watcher) {
        throw new Error('Watcher not found')
      }
      
      const bridge: L2Bridge | L1Bridge = watcher.bridge
      await printAmounts(bridge)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })