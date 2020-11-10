import * as ethers from 'ethers'

export type TransferProps = {
  recipient: string,
  amount: ethers.BigNumber,
  nonce: number,
  relayerFee: ethers.BigNumber
}

export default class Transfer {
  recipient: string
  amount: ethers.BigNumber
  nonce: number
  relayerFee: ethers.BigNumber

  constructor(props: TransferProps) {
    this.recipient = props.recipient
    this.amount = props.amount
    this.nonce = props.nonce
    this.relayerFee = props.relayerFee
  }

  getTransferHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'address',
        'uint256',
        'uint256',
        'uint256'
      ],
      [
        this.recipient,
        this.amount,
        this.nonce,
        this.relayerFee
      ]
    )
    const hash = ethers.utils.keccak256(data)
    return Buffer.from(hash.slice(2), 'hex')
  }
}
