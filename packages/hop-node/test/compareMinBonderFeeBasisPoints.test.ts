/*
import { BigNumber } from 'ethers'
import { compareMinBonderFeeBasisPoints } from 'src/watchers/classes/Bridge'

describe('bonder fee', () => {
  // transferId (optimism->polygon):
  // 0xf6a9aad3a1d8443f3eac4b32bf7cfe3811fa38388df035178db148d53033adcb
  it('to not throw', async () => {
    const amountIn = BigNumber.from('5081424814') // 5081.424814
    const bonderFee = BigNumber.from('9146564') // 9.146564 (18bps)
    const destinationChain = 'polygon'
    const tokenSymbol = 'USDT'

    let threw = false
    try {
      await compareMinBonderFeeBasisPoints(amountIn, bonderFee, destinationChain, tokenSymbol)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeFalsy()
  })

  // transferId (optimism->polygon):
  // 0xc77fc923c76befc045201735d4f5b9da5a6ed9f6b6f9c88a11e4a23e865c41ec
  it('to throw if too low', async () => {
    const amountIn = BigNumber.from('565803984') // 565.803984
    const bonderFee = BigNumber.from('113160') // 0.11316 (2bps)
    const destinationChain = 'polygon'
    const tokenSymbol = 'USDC'

    let threw = false
    try {
      await compareMinBonderFeeBasisPoints(amountIn, bonderFee, destinationChain, tokenSymbol)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeTruthy()
  })
})
*/
