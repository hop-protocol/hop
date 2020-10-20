import { expect } from 'chai'
import { ethers } from '@nomiclabs/buidler'
import { BigNumber, ContractFactory, Signer } from 'ethers'
import MerkleTree from '../lib/MerkleTree'

type WithdrawalProps = {
  amount: BigNumber,
  nonce: number,
  sender: string
}

class Withdrawal {
  amount: BigNumber
  nonce: number
  sender: string

  constructor(props: WithdrawalProps) {
    this.amount = props.amount
    this.nonce = props.nonce
    this.sender = props.sender
  }

  getWithdrawalHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'uint256',
        'uint256',
        'address'
      ],
      [
        this.amount,
        this.nonce,
        this.sender
      ]
    )
    const hash = ethers.utils.keccak256(data)
    return Buffer.from(hash.slice(2), 'hex')
  }
}

describe("Bridge", () => {
  let accounts: Signer[]
  let user: Signer
  let Bridge: ContractFactory
  let withdrawals: Withdrawal[]

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    Bridge = await ethers.getContractFactory('Bridge')
    withdrawals = [
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await user.getAddress(),
      }),
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await accounts[1].getAddress(),
      })
    ]
  })

  it('Should allow for a withdrawal', async () => {
    const bridge = await Bridge.deploy()

    const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )

    const tree = new MerkleTree(withdrawalHashes)
    const root = tree.getRoot()

    await bridge.setWithdrawalRoot(root)

    const userInitialBalance: BigNumber = await bridge.balanceOf(user.getAddress())

    await bridge.connect(user).withdraw(
      withdrawals[0].amount,
      withdrawals[0].nonce,
      root,
      tree.getProof(withdrawalHashes[0])
    )

    const userBalance: BigNumber = await bridge.balanceOf(user.getAddress())

    const amountWithdrawn = userBalance.sub(userInitialBalance)

    expect(amountWithdrawn.toString()).to.eq(withdrawals[0].amount.toString())
  })

  describe('Withdrawal', () => {
    describe('getWithdrawalHash()', () => {
      it('should match onchain hash calculation', async () => {
        const bridge = await Bridge.deploy()

        const onchainHashHex = await bridge.getWithdrawalHash(
          withdrawals[0].amount,
          withdrawals[0].nonce,
          withdrawals[0].sender
        )
        const onchainHash = Buffer.from(
          onchainHashHex.slice(2),
          'hex'
        )

        const offchainHash = withdrawals[0].getWithdrawalHash()

        expect(Buffer.compare(onchainHash, offchainHash)).to.eq(0)
      })
    })
  })
})
