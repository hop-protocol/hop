import { wallets } from '#wallets/index.js'
import { ChainSlug } from '@hop-protocol/sdk'
import { actionHandler, root, parseString } from './shared/index.js'

root
  .command('unwind')
  .description('Unwind ERC20')
  .option('--to <address>', 'To address', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { to } = source

  if (!to) {
    throw new Error('to is required')
  }

  const gnosisChain = ChainSlug.Gnosis
  const gnosisWallet = wallets.get(gnosisChain)

  const opChain = ChainSlug.Optimism
  const opWallet = wallets.get(opChain)

  const recipient = to

  const stETHAddress = '0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6'
  const opAddress = '0x4200000000000000000000000000000000000042'

  // 236504013705435798
  const stETHData = `0xa9059cbb000000000000000000000000${to.substring(2)}00000000000000000000000000000000000000000000000003483b25bcddda96`
  // 65681465303725250000
  const opData = `0xa9059cbb000000000000000000000000${to.substring(2)}0000000000000000000000000000000000000000000000038f8370b2cbb015d0`

  console.log('Sending OP')
  await opWallet.sendTransaction({
    value: '0',
    to: opAddress,
    data: opData
  })

  console.log('Sending stETH')
  await gnosisWallet.sendTransaction({
    value: '0',
    to: stETHAddress,
    data: stETHData
  })

  console.log('Sending DAI')
  await gnosisWallet.sendTransaction({
    value: '27000000000000000000',
    to: recipient
  })
}

