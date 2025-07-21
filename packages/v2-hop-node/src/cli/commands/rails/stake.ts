import { Rails } from '#clients/index.js'
import { Logger } from '#logger/index.js'
import { Argument, Command } from 'commander'
import { parseString } from '../../utils.js'
import { type NetworkSlug, ChainSlug, getChain } from '@hop-protocol/sdk'
import { utils } from 'ethers'
import { Config } from '#config/index.js'

export const program = new Command()

const chainArgument = new Argument('chain', 'Chain to stake on')
  .choices(Object.values(ChainSlug))
  .argParser(parseString)
  .argRequired()

const amountArgument = new Argument('amount', 'Amount to stake')
  .argParser(parseString)
  .argRequired()

program
  .name('stake')
  .description('Stake token in Rails')
  .addArgument(chainArgument)
  .addArgument(amountArgument)
  .action(run)

async function run (chain: ChainSlug, amount: string): Promise<void> {
  const logger = new Logger(program.name())

  // TODO: V2: Automate
  const network: NetworkSlug = Config.GlobalConfig.options.network

  // TODO: V2: Validate chainSlug. Require that it is in the list of chains supported by Rails AND the user's list of chains

  logger.log('staking on chain:', chain, 'amount:', amount)
  const chainId = getChain(network, chain).chainId
  const amountWei = utils.parseEther(amount)
  await Rails.RailsCLI.stakeHop(chainId, amountWei)
  logger.log('Successfully staked', amount, 'HOP on chain:', chain, 'chainId:', chainId)
}
