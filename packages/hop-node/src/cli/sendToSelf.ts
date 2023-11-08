import wallets from 'src/wallets'
import { actionHandler, logger, parseString, root } from './shared'
import { BigNumber } from 'ethers'

root
  .command('send-to-self')
  .description('Send tokens over Hop bridge or send to another recipient')
  .option('--from-chain <slug>', 'From chain', parseString)
  .option('--gas-price-wei <string>', 'Gas price in wei', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { fromChain, gasPriceWei } = source

  if (!fromChain) {
    throw new Error('from-chain is required. E.g. arbitrum')
  }

  if (!gasPriceWei) {
    throw new Error('gas-price-wei is required. E.g. 100000000000')
  }

  const wallet = wallets.get(fromChain)
  const recipient = await wallet.getAddress()
  const nonce = await wallet.provider!.getTransactionCount(recipient)

  const txOverrides: any = {
    gasPrice: gasPriceWei ? BigNumber.from(gasPriceWei) : undefined,
    nonce: nonce ? BigNumber.from(nonce) : undefined
  }

  const tx = await wallet.sendTransaction({
    value: BigNumber.from(0),
    to: recipient,
    nonce,
    ...txOverrides
  })
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug(`send complete`)
}