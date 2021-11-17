import chainSlugToId from 'src/utils/chainSlugToId'
import { BigNumber } from 'ethers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

import { logger, program } from './shared'

async function stake (
  chain: string,
  token: string,
  amount: number,
  skipSendToL2: boolean = false
) {
  logger.debug('Staking')
  const isBonder = await this.bridge.isBonder()
  if (!isBonder) {
    throw new Error('not an allowed bonder on chain')
  }

  let tx
  if (!skipSendToL2) {
    const chainId: number = chainSlugToId(chain)!
    tx = await this.bridge.sendCanonicalTokensToL2(
      chainId,
      amount
    )
    await tx.wait()
  }

  if (!token) {
  const hTokenBalance = await this.bridge.getBalance()
  const parsedAmount: BigNumber = this.bridge.parseUnits(amount)
  if (hTokenBalance.lt(parsedAmount)) {
    throw new Error(
      `not enough hToken balance to stake. Have ${this.bridge.formatUnits(
        hTokenBalance
      )}, need ${amount}`
    )
  }

  this.logger.debug(`attempting to stake ${amount} tokens`)
  tx = await this.bridge.stake(amount)
  this.logger.info(`stake tx: ${(tx.hash)}`)
  const receipt = await tx.wait()
  if (receipt.status) {
    this.logger.debug(`stake successful`)
  } else {
    this.logger.error('stake unsuccessful')
  }
}

program
  .command('stake')
  .description('Stake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .option('-s, --skip-send-to-l2 <boolean>', 'Stake hTokens that already exist on L2')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      const skipSendToL2 = source.skipSendToL2

      if (!amount) {
        throw new Error('amount is required. E.g. 100')
      }

      await stake(chain, token, amount, skipSendToL2)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
