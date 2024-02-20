import { getRpcProvider } from '@hop-protocol/hop-node-core/utils'
import { BigNumber, Wallet } from 'ethers'
import { TxOverrides } from '@hop-protocol/hop-node-core/types'
import { actionHandler, logger, parseString, root } from './shared/index.js'
import {
  config as globalConfig
} from 'src/config/index.js'

root
  .command('send-to-self')
  .description('Send tokens over Hop bridge or send to another recipient')
  .option('--from-chain <slug>', 'From chain', parseString)
  .option('--gas-price-wei <string>', 'Gas price in wei', parseString)
  .option('--nonce <string>', 'Nonce', parseString)
  .option('--nonce-end <string>', 'Last nonce', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { fromChain, gasPriceWei, nonce, nonceEnd } = source

  if (!fromChain) {
    throw new Error('from-chain is required. E.g. arbitrum')
  }

  if (!gasPriceWei) {
    throw new Error('gas-price-wei is required. E.g. 100000000000')
  }

  if (!nonce) {
    throw new Error('nonce is required. E.g. 0')
  }

  const provider = getRpcProvider(fromChain)
  const wallet = new Wallet(globalConfig.bonderPrivateKey, provider)
  const recipient = await wallet.getAddress()

  const txOverrides: TxOverrides = {
    gasPrice: gasPriceWei ? BigNumber.from(gasPriceWei) : undefined,
    nonce: BigNumber.from(nonce)
  }

  logger.info(`sending to self on ${fromChain} with gas price ${gasPriceWei} and nonce ${nonce}`)
  
  if (nonceEnd) {
    const nonceStart = nonce
    for (let i = Number(nonceStart); i <= Number(nonceEnd); i++) {
      await sendToSelf(wallet, recipient, txOverrides)
      txOverrides.nonce = BigNumber.from(txOverrides.nonce).add(1)
    }
  }  else {
    await sendToSelf(wallet, recipient, txOverrides)
  }
}

async function sendToSelf (wallet: Wallet, recipient: string, txOverrides: TxOverrides): Promise<void> {
  const tx = await wallet.sendTransaction({
    value: BigNumber.from(0),
    to: recipient,
    nonce: txOverrides.nonce,
    gasPrice: txOverrides.gasPrice
  })
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug('send complete')
}
