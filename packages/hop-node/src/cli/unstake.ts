import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

export async function unstake (
  chain: string,
  token: string,
  amount: number,
) {
  logger.debug('Unstaking')
  const parsedAmount = this.bridge.formatUnits(amount)
  const [credit, debit] = await Promise.all([
    this.bridge.getCredit(),
    this.bridge.getDebit()
  ])

  const availableCredit = credit.sub(debit)
  if (parsedAmount.gt(availableCredit)) {
    throw new Error(
      `cannot unstake more than the available credit ${this.bridge.formatUnits(
       availableCredit 
      )}`
    )
  }

  this.logger.debug(`attempting to unstake ${amount} tokens`)
  const tx = await this.bridge.unstake(amount)
  this.logger.info(`unstake tx: ${(tx.hash)}`)
  const receipt = await tx.wait()
  if (receipt.status) {
    this.logger.debug(`successfully unstaked ${parsedAmount} tokens`)
  } else {
    this.logger.error('unstake was unsuccessful. tx status=0')
  }
}

program
  .command('unstake')
  .description('Unstake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)

      if (!amount) {
        throw new Error('amount is required. E.g. 100')
      }

      await unstake(chain, token, amount)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
