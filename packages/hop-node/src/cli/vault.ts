import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { Vault } from 'src/vault'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import { nativeChainTokens } from 'src/constants'

enum Actions {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

root
  .command('vault')
  .description('Yearn vault')
  .option('--strategy <value>', 'Vault strategy: Options are: yearn, aave', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--chain <slug>', 'Chain', parseString)
  .option('--amount <number>', 'From token amount (in human readable format)', parseNumber)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { args, strategy, token, chain, amount, max, dry: dryMode } = source
  const action = args[0]
  const actionOptions = Object.values(Actions)
  if (!action) {
    throw new Error('please specify subcommand')
  }
  if (!actionOptions.includes(action)) {
    throw new Error(`Please choose a valid option. Valid options include ${actionOptions}.`)
  }
  if (!strategy) {
    throw new Error('strategy is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!(amount || max)) {
    throw new Error('amount is required')
  }
  if (amount && max) {
    throw new Error('cannot use both amount and max flags')
  }

  const signer = wallets.get(chain)
  const isNative = nativeChainTokens[chain] === token
  const vault = Vault.from(strategy, chain, token, signer)
  if (!vault) {
    throw new Error(`no vault strategy found for token "${token}" on chain "${chain}"`)
  }
  logger.debug(`isNative: ${isNative}`)
  if (action === Actions.Deposit) {
    let parsedAmount: BigNumber
    if (max) {
      if (isNative) {
        parsedAmount = await signer.getBalance()
      } else {
        const config = contracts.get(token, chain)
        const tokenContract = config.l1CanonicalToken ?? config.l2CanonicalToken
        if (!tokenContract) {
          throw new Error(`token contract not found for ${chain}.${token}`)
        }
        const tokenClass = new Token(tokenContract)
        parsedAmount = await tokenClass.getBalance()
      }
      logger.log(`max amount: ${parsedAmount.toString()}`)
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
    let parsedAmount: BigNumber
    if (max) {
      parsedAmount = await vault.getBalance()
      logger.log(`max amount: ${parsedAmount.toString()}`)
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
