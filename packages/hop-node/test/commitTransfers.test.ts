import { bonderPrivateKey, governancePrivateKey } from './config'
import { User } from './helpers'
// @ts-ignore
import { KOVAN, XDAI, OPTIMISM, DAI } from 'src/constants'

test(
  'commitTransfers',
  async () => {
    const user = new User(bonderPrivateKey)
    const sourceChain = OPTIMISM
    const destChain = XDAI
    const token = DAI
    const pendingTransfers = await user.getPendingTransfers(
      sourceChain,
      token,
      destChain
    )
    console.log('pending transfers:', pendingTransfers)

    const isBonder = await user.isBonder(sourceChain, token)
    console.log('is bonder:', isBonder)

    const bridge = await user.getHopBridgeContract(sourceChain, token)
    console.log('messenger address:', await bridge.messenger())
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
  const tx = await gov.setMaxPendingTransfers(OPTIMISM, max)
  const receipt = await tx.wait()
  console.log(tx?.hash)
  expect(receipt.status).toBe(1)

  const result = await gov.getMaxPendingTransfers(OPTIMISM)
  expect(result).toBe(max)
})
