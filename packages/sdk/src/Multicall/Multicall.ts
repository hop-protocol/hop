import Multicall3Abi from '@hop-protocol/core/abi/static/Multicall3.json'
import { ethers } from 'ethers'

export class Multicall {
  async getBalances (userAddress: string) {
    // Set up the provider (e.g., Infura, Alchemy)
    const provider = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213') // public rpc

    // Multicall3 contract address and ABI
    const multicallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11' // optimism

    // ERC20 token addresses and ABI
    const tokenAddresses = ['0x7F5c764cBc14f9669B88837ca1490cCa17c31607', '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'] // USDC, DAI
    const erc20ABI = ['function balanceOf(address) view returns (uint)']

    // Create Multicall3 contract instance
    const multicallContract = new ethers.Contract(multicallAddress, Multicall3Abi, provider)

    // Create calls array
    const calls = tokenAddresses.map(tokenAddress => {
      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider)
      return {
        target: tokenAddress,
        callData: tokenContract.interface.encodeFunctionData('balanceOf', [userAddress])
      }
    })

    // Call Multicall3
    const result = await multicallContract.callStatic.aggregate3(calls)

    // Decode the returned data
    const balances = result.map((data: any, index: number) => {
      const returnData = data.returnData
      return {
        token: tokenAddresses[index],
        balance: ethers.utils.defaultAbiCoder.decode(['uint256'], returnData)[0].toString()
      }
    })

    return balances
  }
}
