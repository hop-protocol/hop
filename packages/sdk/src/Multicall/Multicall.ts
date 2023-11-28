import ERC20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import Multicall3Abi from '@hop-protocol/core/abi/static/Multicall3.json'
import { Contract, constants, providers } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { config as sdkConfig } from '../config'

type Config = {
  network: string
  accountAddress: string
}

export class Multicall {
  network: string
  accountAddress: string

  constructor (config: Config) {
    if (!config) {
      throw new Error('config is required')
    }
    if (!config.network) {
      throw new Error('config.network is required')
    }
    if (!config.accountAddress) {
      throw new Error('config.accountAddress is required')
    }
    this.network = config.network
    this.accountAddress = config.accountAddress
  }

  getMulticallAddressForChain (chainSlug: string) {
    const address = sdkConfig[this.network].chains?.[chainSlug]?.multicall
    if (!address) {
      throw new Error(`multicallAddress not found for chain ${chainSlug}`)
    }
    return address
  }

  getProvider (chainSlug: string) {
    const rpcUrl = sdkConfig[this.network].chains?.[chainSlug]?.rpcUrl
    if (!rpcUrl) {
      throw new Error(`rpcUrl not found for chain ${chainSlug}`)
    }
    const provider = new providers.JsonRpcProvider(rpcUrl)
    return provider
  }

  getChains () {
    const chains = Object.keys(sdkConfig[this.network].chains)
    return chains
  }

  getTokenAddressesForChain (chainSlug: string) {
    const tokenConfigs = sdkConfig[this.network]?.addresses
    const addresses : any[] = []
    for (const tokenSymbol in tokenConfigs) {
      const chainConfig = tokenConfigs[tokenSymbol]?.[chainSlug]
      if (!chainConfig) {
        continue
      }
      const address = chainConfig?.l2CanonicalToken ?? chainConfig?.l1CanonicalToken
      if (!address) {
        throw new Error(`canonicalToken not found for chain ${chainSlug}`)
      }
      if (address === constants.AddressZero) {
        continue
      }
      addresses.push({
        tokenSymbol,
        address
      })
    }
    return addresses
  }

  async getBalances () {
    const chains = this.getChains()
    const promises: any[] = []
    for (const chain of chains) {
      promises.push(this.getBalancesForChain(chain))
    }
    const balances = await Promise.all(promises)
    return balances.flat()
  }

  async getBalancesForChain (chainSlug: string) {
    const provider = this.getProvider(chainSlug)
    const multicallAddress = this.getMulticallAddressForChain(chainSlug)
    const tokenAddresses = this.getTokenAddressesForChain(chainSlug)
    const multicallContract = new Contract(multicallAddress, Multicall3Abi, provider)

    const calls = tokenAddresses.map(({ address }: any) => {
      const tokenContract = new Contract(address, ERC20Abi, provider)
      return {
        target: address,
        callData: tokenContract.interface.encodeFunctionData('balanceOf', [this.accountAddress])
      }
    })

    const result = await multicallContract.callStatic.aggregate3(calls)

    const balances = result.map((data: any, index: number) => {
      const returnData = data.returnData
      const { tokenSymbol, address } = tokenAddresses[index]
      try {
        const balance = defaultAbiCoder.decode(['uint256'], returnData)[0].toString()
        return {
          tokenSymbol,
          address,
          balance,
          chainSlug
        }
      } catch (err: any) {
        return {
          tokenSymbol,
          address,
          chainSlug,
          error: err.message
        }
      }
    })

    return balances
  }
}
