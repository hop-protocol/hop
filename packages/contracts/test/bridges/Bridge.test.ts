import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract, BigNumber } from 'ethers'
import { fixture } from '../shared/fixtures'
import Transfer from '../../lib/Transfer'
import {
  setUpDefaults,
  generateAmountHash
} from '../shared/utils'
import {
  L2_NAMES,
  IFixture
} from '../shared/constants'

describe("Bridge", () => {
  let _fixture: IFixture

  let committee: Signer

  let bridge: Contract
  let transfers: Transfer[]

  beforeEach(async () => {
    const l2Name = L2_NAMES.OPTIMISM
    _fixture = await fixture(l2Name)
    await setUpDefaults(_fixture, l2Name)

    ;({ 
      committee,
      bridge,
      transfers
    } = _fixture);
  })

  /**
   * Happy Path
   */

  it('Should get the correct transfer hash', async () => {
    for (let i = 0; i < transfers.length; i++) {
      const transfer: Transfer = transfers[i]
      const expectedTransferHash: Buffer = transfer.getTransferHash()
      const transferHash = await bridge.getTransferHash(
        transfer.chainId,
        transfer.sender,
        transfer.recipient,
        transfer.amount,
        transfer.transferNonce,
        transfer.relayerFee,
        transfer.amountOutMin,
        transfer.deadline
      )
      expect(transferHash).to.eq('0x' + expectedTransferHash.toString('hex'))
    }
  })

  it('Should get the correct amount hash', async () => {
    const chainIds: Number[] = [10, 79377087078960]
    const amounts: Number[] = [123, 999]

    const expectedAmountHash: Buffer = generateAmountHash(chainIds, amounts)
    const amountHash = await bridge.getAmountHash(chainIds, amounts)
    expect(amountHash).to.eq('0x' + expectedAmountHash.toString('hex'))
  })

  it('Should get the correct transfer root from a root hash', async () => {
    // TODO
  })

  it('Should get the correct bonded withdrawal amount from a transfer hash', async () => {
    // TODO
  })

  /**
   * Non-Happy Path
   */

   // TODO

})