import { Contract } from 'ethers'
// import { parseAbi } from 'abitype'
import { TypedContract } from './ethers-abitype'

const address = '0x0000000000000000000000000000000000000000'
// const abi = parseAbi([
//   'function symbol() external returns (string)',
//   'function decimals() external returns (uint256)'
// ])

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

const contract = new Contract(address, abi) as unknown as TypedContract<typeof abi>
console.log(contract)
