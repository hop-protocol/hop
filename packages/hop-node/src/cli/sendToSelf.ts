import wallets from 'src/wallets'
import { actionHandler, logger, parseString, root } from './shared'
import { BigNumber, Wallet } from 'ethers'
import {
  config as globalConfig,
} from 'src/config'
import getRpcProvider from 'src/utils/getRpcProvider'


root
  .command('send-to-self')
  .description('Send tokens over Hop bridge or send to another recipient')
  .option('--from-chain <slug>', 'From chain', parseString)
  .option('--gas-price-wei <string>', 'Gas price in wei', parseString)
  .option('--nonce <string>', 'Nonce', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { fromChain, gasPriceWei, nonce } = source

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
  const wallet = new Wallet(globalConfig.bonderPrivateKey, provider!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const recipient = await wallet.getAddress()

  const txOverrides: any = {
    gasPrice: gasPriceWei ? BigNumber.from(gasPriceWei) : undefined,
    nonce: nonce ? BigNumber.from(nonce) : undefined
  }


  logger.info(`sending to self on ${fromChain} with gas price ${gasPriceWei} and nonce ${nonce}`)
  const tx = await wallet.sendTransaction({
    value: BigNumber.from(0),
    to: recipient,
    nonce: txOverrides.nonce,
    gasPrice: txOverrides.gasPrice
  })
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug(`send complete`)
}