import * as ethers from 'ethers'

export type TransferProps = {
  chainId: ethers.BigNumber,
  recipient: string,
  amount: ethers.BigNumber,
  nonce: number,
  relayerFee: ethers.BigNumber
}

export default class Transfer {
  chainId: ethers.BigNumber
  recipient: string
  amount: ethers.BigNumber
  nonce: number
  relayerFee: ethers.BigNumber

  constructor(props: TransferProps) {
    this.chainId = props.chainId
    this.recipient = props.recipient
    this.amount = props.amount
    this.nonce = props.nonce
    this.relayerFee = props.relayerFee
  }

  getTransferHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'uint256',
        'address',
        'uint256',
        'uint256',
        'uint256'
      ],
      [
        this.chainId,
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
