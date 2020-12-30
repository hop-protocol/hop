import * as ethers from 'ethers'

export type TransferAmountsProps = {
  ids: string[],
  amounts: ethers.BigNumber[]
}

export default class TransferAmounts {
  ids: string[]
  amounts: ethers.BigNumber[]

  constructor(props: TransferAmountsProps) {
    this.ids = props.ids
    this.amounts = props.amounts
  }

  getTransferAmountsHash(): Buffer {
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        'bytes32[]',
        'uint256[]'
      ],
      [
        this.ids,
        this.amounts
      ]
    )
    const hash = ethers.utils.keccak256(data)
    return Buffer.from(hash.slice(2), 'hex')
  }
}
