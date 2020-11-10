import * as ethers from 'ethers'

export type TransferProps = {
  amount: ethers.BigNumber,
  nonce: number,
  sender: string
  relayerFee: ethers.BigNumber
}

export default class Transfer {
  amount: ethers.BigNumber
  nonce: number
  sender: string
  relayerFee: ethers.BigNumber

  constructor(props: TransferProps) {
    this.amount = props.amount
    this.nonce = props.nonce
    this.sender = props.sender
    this.relayerFee = props.relayerFee
  }

  getTransferHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'uint256',
        'uint256',
        'address',
        'uint256'
      ],
      [
        this.amount,
        this.nonce,
        this.sender,
        this.relayerFee
      ]
    )
    const hash = ethers.utils.keccak256(data)
    return Buffer.from(hash.slice(2), 'hex')
  }
}
