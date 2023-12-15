import ERC20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import Multicall3Abi from '@hop-protocol/core/abi/static/Multicall3.json'
import { Contract, constants, providers } from 'ethers'
import { PriceFeedFromS3 } from '../priceFeed'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { getTokenDecimals } from '../utils/getTokenDecimals'
import { config as sdkConfig } from '../config'

export type Config = {
  network: string
  accountAddress: string
}

export type Balance = {
  tokenSymbol: string
  address: string
  chainSlug: string
  balance?: string
  balanceFormatted?: string
  balanceUsd?: string
  tokenPrice?: string
  error?: string
}

export type TokenAddress = {
  tokenSymbol: string
  address: string
}

export type GetBalanceOptions = {
  abi?: any
  method?: string
  address?: string
  tokenSymbol?: string
  tokenDecimals?: number
}

export class Multicall {
  network: string
  accountAddress: string
  priceFeed: PriceFeedFromS3

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
    this.priceFeed = new PriceFeedFromS3()
  }

  getMulticallAddressForChain (chainSlug: string): string {
    const address = sdkConfig[this.network].chains?.[chainSlug]?.multicall
    if (!address) {
      throw new Error(`multicallAddress not found for chain ${chainSlug}`)
    }
    return address
  }

  getProvider (chainSlug: string): providers.Provider {
    const rpcUrl = sdkConfig[this.network].chains?.[chainSlug]?.rpcUrl
    if (!rpcUrl) {
      throw new Error(`rpcUrl not found for chain ${chainSlug}`)
    }
    const provider = new providers.JsonRpcProvider(rpcUrl)
    return provider
  }

  getChains (): string[] {
    const chains = Object.keys(sdkConfig[this.network].chains)
    return chains
  }

  getTokenAddressesForChain (chainSlug: string): TokenAddress[] {
    const tokenConfigs = sdkConfig[this.network]?.addresses
    const addresses : TokenAddress[] = []
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

  async getBalances ():Promise<Balance[]> {
    const chains = this.getChains()
    const promises: Promise<any>[] = []
    for (const chain of chains) {
      promises.push(this.getBalancesForChain(chain))
    }
    const balances = await Promise.all(promises)
    return balances.flat()
  }

  async getBalancesForChain (chainSlug: string, opts?: GetBalanceOptions[]): Promise<Balance[]> {
    const provider = this.getProvider(chainSlug)
    const multicallAddress = this.getMulticallAddressForChain(chainSlug)
    const tokenAddresses : GetBalanceOptions[] | TokenAddress = Array.isArray(opts) ? opts : this.getTokenAddressesForChain(chainSlug)
    const multicallContract = new Contract(multicallAddress, Multicall3Abi, provider)

    const calls = tokenAddresses.map(({ address, abi, method }: TokenAddress & {abi: any, method: string}) => {
      const tokenContract = new Contract(address, abi ?? ERC20Abi, provider)
      const balanceMethod = method ?? 'balanceOf'
      return {
        target: address,
        callData: tokenContract.interface.encodeFunctionData(balanceMethod, [this.accountAddress])
      }
    })

    const result = await multicallContract.callStatic.aggregate3(calls)

    const balancePromises = result.map(async (data: any, index: number) => {
      const returnData = data.returnData
      const { tokenSymbol, address, tokenDecimals } = tokenAddresses[index]
      try {
        const balance = defaultAbiCoder.decode(['uint256'], returnData)[0]
        const _tokenDecimals = tokenDecimals ?? getTokenDecimals(tokenSymbol)
        const balanceFormatted = Number(formatUnits(balance, _tokenDecimals))
        const tokenPrice = opts ? null : await this.priceFeed.getPriceByTokenSymbol(tokenSymbol) // don't fetch usd price if using custom abi
        const balanceUsd = tokenPrice ? balanceFormatted * tokenPrice : null
        return {
          tokenSymbol,
          address,
          chainSlug,
          balance,
          balanceFormatted,
          balanceUsd,
          tokenPrice
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

    const balances = await Promise.all(balancePromises)

    return balances
  }
}
