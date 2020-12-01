import * as ethers from 'ethers'

export type TransferProps = {
  layerId: string,
  recipient: string,
  amount: ethers.BigNumber,
  nonce: number,
  relayerFee: ethers.BigNumber
}

export default class Transfer {
  layerId: string
  recipient: string
  amount: ethers.BigNumber
  nonce: number
  relayerFee: ethers.BigNumber

  constructor(props: TransferProps) {
    this.layerId = props.layerId
    this.recipient = props.recipient
    this.amount = props.amount
    this.nonce = props.nonce
    this.relayerFee = props.relayerFee
  }

  getTransferHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'bytes32',
        'address',
        'uint256',
        'uint256',
        'uint256'
      ],
      [
        this.layerId,
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
