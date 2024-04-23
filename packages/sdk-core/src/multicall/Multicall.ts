import { providers, utils } from 'ethers'
import { Multicall3__factory } from '#contracts/index.js'
import { PriceFeedFromS3 } from '#priceFeed/index.js'
import { ERC20__factory } from '#contracts/index.js'
import { getTokenDecimals } from '#utils/index.js'
import { sdkConfig } from '#config/index.js'

type Config = {
  network: string
  accountAddress?: string
}

export type MulticallBalance = {
  tokenSymbol: string
  address: string
  chainSlug: string
  balance?: string
  balanceFormatted?: string
  balanceUsd?: string
  tokenPrice?: string
  error?: string
}

type GetMulticallBalanceOptions = {
  abi?: any
  method?: string
  address?: string
  tokenSymbol?: string
  tokenDecimals?: number
}

type MulticallOptions = {
  address: string
  abi: Array<any>
  method: string
  args: Array<any>
}

export class Multicall {
  network: string
  accountAddress?: string
  priceFeed: PriceFeedFromS3

  constructor (config: Config) {
    if (!config) {
      throw new Error('config is required')
    }
    if (!config.network) {
      throw new Error('config.network is required')
    }
    this.network = config.network
    this.accountAddress = config.accountAddress
    this.priceFeed = new PriceFeedFromS3()
  }

  getMulticallAddressForChain (chainSlug: string): string | null {
    const address = sdkConfig[this.network].chains?.[chainSlug]?.multicall
    if (!address) {
      return null
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

  async multicall (chainSlug: string, options: MulticallOptions[]): Promise<Array<any>> {
    const provider = this.getProvider(chainSlug)
    const multicallAddress = this.getMulticallAddressForChain(chainSlug)
    const calls = options.map(({ address, abi, method, args }: any) => {
      const contractInterface = new utils.Interface(abi)
      const calldata = contractInterface.encodeFunctionData(method, args)
      return {
        target: address,
        allowFailure: false,
        callData: calldata
      }
    })

    let results : any
    if (multicallAddress) {
      const multicallContract = Multicall3__factory.connect(multicallAddress, provider)
      results = await multicallContract.callStatic.aggregate3(calls)
    } else {
      results = await Promise.all(calls.map(async ({ target, callData }: any) => {
        const result = await provider.call({ to: target, data: callData })
        return result
      }))
    }

    const parsed = results.map((data: any, index: number) => {
      let returnData = data
      if (multicallAddress) {
        returnData = data.returnData
      }
      const { abi, method } = options[index]
      const contractInterface = new utils.Interface(abi)
      for (const key in contractInterface.functions) {
        const _method = key.split('(')[0]
        if (_method === method) {
          const returnTypes = contractInterface?.functions[key]?.outputs?.map((output: any) => output.type)
          const returnValues = utils.defaultAbiCoder.decode(returnTypes!, returnData)
          return returnValues
        }
      }

      return null
    })

    return parsed
  }

  async getBalancesForChain (chainSlug: string, multicallBalanceOpts: GetMulticallBalanceOptions[]): Promise<MulticallBalance[]> {
    if (!this.accountAddress) {
      throw new Error('config.accountAddress is required')
    }
    const provider = this.getProvider(chainSlug)
    const multicallAddress = this.getMulticallAddressForChain(chainSlug)

    const calls = await Promise.all(multicallBalanceOpts.map(async ({ address, method }: GetMulticallBalanceOptions) => {
      const tokenContract = ERC20__factory.connect(address!, provider)
      const balanceTx = await tokenContract.populateTransaction.balanceOf(this.accountAddress!)
      return {
        target: address!,
        allowFailure: false,
        callData: balanceTx.data!
      }
    }))

    let results: any
    if (multicallAddress) {
      const multicallContract = Multicall3__factory.connect(multicallAddress, provider)
      results = await multicallContract.callStatic.aggregate3(calls)
    } else {
      results = await Promise.all(calls.map(async ({ target, callData }: any) => {
        const result = await provider.call({ to: target, data: callData })
        return result
      }))
    }

    const balancePromises = results.map(async (data: any, index: number) => {
      let returnData = data
      if (multicallAddress) {
        returnData = data.returnData
      }
      const { tokenSymbol, address, tokenDecimals } = multicallBalanceOpts[index]
      try {
        const balance = utils.defaultAbiCoder.decode(['uint256'], returnData)[0]
        const _tokenDecimals = tokenDecimals ?? getTokenDecimals(tokenSymbol!)
        const balanceFormatted = Number(utils.formatUnits(balance, _tokenDecimals))
        const tokenPrice = multicallBalanceOpts ? null : await this.priceFeed.getPriceByTokenSymbol(tokenSymbol!) // don't fetch usd price if using custom abi
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
