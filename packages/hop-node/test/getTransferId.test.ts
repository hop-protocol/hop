import getTransferId from '#utils/getTransferId.js'
import { BigNumber } from 'ethers'

describe('getTransferId', () => {
  it('getTransferId', () => {
    const chainId = 100
    const recipient = '0x9e89EAC1F28Ac6A0E5FeDadE151b60A16E0c1a62'
    const amount = BigNumber.from('0x10d9e4')
    const transferNonce = '0x9dbd5b8db3a626f9d4c1c0da331dad22e51c17c4ba475a5cd9db706814d85510'
    const bonderFee = BigNumber.from('0x0f2499')
    const amountOutMin = BigNumber.from('0x00')
    const deadline = BigNumber.from('0x6172f313')
    expect(getTransferId(chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline)).toBe('0x35b073ae20649aaecf66d898c6af46dac818ed880c7177c4cf24845b00cab845')
  })
})
