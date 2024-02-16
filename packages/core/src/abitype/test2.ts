import { Contract, providers, Signer } from 'ethers'
import { Abi, TypedContract } from './ethers-abitype'

const abi = [
  {
    "name": "symbol",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": [
      {
        "type": "string"
      }
    ]
  },
  {
    "name": "decimals",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256"
      }
    ]
  }
] as const

export class TEST__factory extends Contract {
  static connect(address: string, provider: providers.Provider | Signer): TypedContract<typeof abi> {
    const contract = new this(address, abi, provider)
    return (contract.connect(provider) as unknown as TypedContract<typeof abi>)
  }
}

export type TEST = TypedContract<typeof abi>
