import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { Vault } from 'src/vault'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'

enum Actions {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

root
  .command('vault')
  .description('Yearn vault')
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'From token amount (in human readable format)', parseNumber)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { args, token, amount, max, dry: dryMode } = source
  const action = args[0]
  const actionOptions = Object.values(Actions)
  if (!action) {
    throw new Error('please specify subcommand')
  }
  if (!actionOptions.includes(action)) {
    throw new Error(`Please choose a valid option. Valid options include ${actionOptions}.`)
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!amount) {
    throw new Error('amount is required')
  }

  const chain = Chain.Ethereum
  const signer = wallets.get(chain)
  if (action === Actions.Deposit) {
    const vault = new Vault(token, signer)
    let parsedAmount: BigNumber
    if (max) {
      throw new Error('todo: max')
    } else {
      parsedAmount = vault.parseUnits(amount)
    }
    if (dryMode) {
      logger.warn(`dry: ${dryMode}, skipping deposit tx`)
    } else {
      const tx = await vault.deposit(parsedAmount)
      logger.log('deposit tx:', tx.hash)
    }
  } else if (action === Actions.Withdraw) {
    const vault = new Vault(token, signer)
    let parsedAmount: BigNumber
    if (max) {
      parsedAmount = await vault.getBalance()
    } else {
      parsedAmount = vault.parseUnits(amount)
    }
    if (dryMode) {
      logger.warn(`dry: ${dryMode}, skipping deposit tx`)
    } else {
      const tx = await vault.withdraw(parsedAmount)
      logger.log('withdraw tx:', tx.hash)
    }
  }

  logger.log('done')
}
