import * as ethers from 'ethers'

export type WithdrawalProps = {
  amount: ethers.BigNumber,
  nonce: number,
  sender: string
}

export default class Withdrawal {
  amount: ethers.BigNumber
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
