import { Chain } from 'src/constants'
import { User } from './helpers'
import { bonderPrivateKey, governancePrivateKey } from './config'

test(
  'commitTransfers',
  async () => {
    const user = new User(bonderPrivateKey)
    const sourceChain = Chain.xDai
    const destChain = Chain.Ethereum
    const token = 'USDC'
    const pendingTransfers = await user.getPendingTransfers(
      sourceChain,
      token,
      destChain
    )
    console.log('pending transfers:', pendingTransfers)

    const isBonder = await user.isBonder(sourceChain, token)
    console.log('is bonder:', isBonder)

    const bridge = await user.getHopBridgeContract(sourceChain, token)
    // console.log('messenger address:', await bridge.messenger())
    console.log('l1 address:', await bridge.l1BridgeAddress())

    const tx = await user.commitTransfers(sourceChain, token, destChain)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
  },
  60 * 1000
)

test.skip('setMaxPendingTransfers', async () => {
  const gov = new User(governancePrivateKey)
  const max = 100
  const tx = await gov.setMaxPendingTransfers(Chain.Optimism, max)
  const receipt = await tx.wait()
  console.log(tx?.hash)
  expect(receipt.status).toBe(1)

  const result = await gov.getMaxPendingTransfers(Chain.Optimism)
  expect(result).toBe(max)
})
