import * as ethers from 'ethers'

export type TransferProps = {
  chainId: ethers.BigNumber,
  sender: string,
  recipient: string,
  amount: ethers.BigNumber,
  nonce: number,
  relayerFee: ethers.BigNumber,
  amountOutMin: ethers.BigNumber
  deadline: ethers.BigNumber
}

export default class Transfer {
  chainId: ethers.BigNumber
  sender: string
  recipient: string
  amount: ethers.BigNumber
  nonce: number
  relayerFee: ethers.BigNumber
  amountOutMin: ethers.BigNumber
  deadline: ethers.BigNumber

  constructor(props: TransferProps) {
    this.chainId = props.chainId
    this.sender = props.sender
    this.recipient = props.recipient
    this.amount = props.amount
    this.nonce = props.nonce
    this.relayerFee = props.relayerFee
    this.amountOutMin = props.amountOutMin
    this.deadline = props.deadline
  }

  getTransferHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'uint256',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256'
      ],
      [
        this.chainId,
        this.sender,
        this.recipient,
        this.amount,
        this.nonce,
        this.relayerFee,
        this.amountOutMin,
        this.deadline
      ]
    )
    const hash = ethers.utils.keccak256(data)
    return Buffer.from(hash.slice(2), 'hex')
  }
}
