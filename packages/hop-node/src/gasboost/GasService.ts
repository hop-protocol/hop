import Logger from 'src/logger'
import fetch from 'node-fetch'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { alchemyApiKey, blocknativeApiKey, etherscanEthereumApiKey } from 'src/config'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

type GasFeeData = {
  maxFeePerGas: BigNumber | null
  maxPriorityFeePerGas: BigNumber | null
  gasPrice: BigNumber | null
}

type GasEstimation = {
  fast: GasFeeData
  standard: GasFeeData
  slow: GasFeeData
}

class Etherchain {
  baseUrl: string = 'https://etherchain.org/api'

  async getGasFeeData (): Promise<GasEstimation> {
    const url = `${this.baseUrl}/gasnow`
    const res = await fetch(url)
    const json = await res.json()
    const result = json?.data
    if (!result?.standard) {
      console.error(json)
      throw new Error('invalid response')
    }
    return {
      fast: this.normalizeItem(result.rapid),
      standard: this.normalizeItem(result.fast),
      slow: this.normalizeItem(result.standard)
    }
  }

  private normalizeItem (value: string) {
    return {
      maxFeePerGas: null,
      maxPriorityFeePerGas: null,
      gasPrice: BigNumber.from(value)
    }
  }
}

class Etherscan {
  baseUrl: string = 'https://api.etherscan.io/api'

  async getGasFeeData (): Promise<GasEstimation> {
    const url = `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${etherscanEthereumApiKey}`
    const res = await fetch(url)
    const json = await res.json()
    const result = json?.result
    if (!result?.ProposeGasPrice) {
      console.error(json)
      throw new Error('invalid response')
    }
    return {
      fast: this.normalizeItem(result.FastGasPrice),
      standard: this.normalizeItem(result.ProposeGasPrice),
      slow: this.normalizeItem(result.SafeGasPrice)
    }
  }

  async getTimeEstimation (gasPrice: string) {
    const url = `${this.baseUrl}?module=gastracker&action=gasestimate&gasprice=${gasPrice}&apikey=${etherscanEthereumApiKey}`
    const res = await fetch(url)
    const json = await res.json()
    return json.result
  }

  private normalizeItem (value: string) {
    return {
      maxFeePerGas: null,
      maxPriorityFeePerGas: null,
      gasPrice: parseUnits(value.toString(), 9)
    }
  }
}

class Blocknative {
  baseUrl: string = 'https://api.blocknative.com'

  async getGasFeeData (): Promise<GasEstimation> {
    const url = `${this.baseUrl}/gasprices/blockprices`
    const res = await fetch(url, {
      headers: {
        Authorization: blocknativeApiKey!
      }
    })
    const json = await res.json()
    const estimatedPrices = json.blockPrices?.[0]?.estimatedPrices
    if (!estimatedPrices?.length) {
      console.error(json)
      throw new Error('invalid response')
    }
    return {
      fast: this.normalizeItem(estimatedPrices[0]),
      standard: this.normalizeItem(estimatedPrices[1]),
      slow: this.normalizeItem(estimatedPrices[2])
    }
  }

  private normalizeItem (item: any) {
    return {
      maxFeePerGas: parseUnits(item.maxFeePerGas.toString(), 9),
      maxPriorityFeePerGas: parseUnits(item.maxPriorityFeePerGas.toString(), 9),
      gasPrice: parseUnits(item.price.toString(), 9)
    }
  }
}

class Alchemy {
  web3: any = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`)

  async getGasFeeData () {
    const slowPercentile = 50
    const standardPercentile = 75
    const fastPercentile = 90
    const result = await this.web3.eth.getFeeHistory(10, 'latest', [slowPercentile, standardPercentile, fastPercentile])
    let slow = BigNumber.from(0)
    let standard = BigNumber.from(0)
    let fast = BigNumber.from(0)
    let count = 0

    if (!result?.reward) {
      console.error(result)
      throw new Error('invalid response')
    }

    for (const item of result.reward) {
      const _slow = BigNumber.from(item[0])
      const _standard = BigNumber.from(item[1])
      const _fast = BigNumber.from(item[2])
      if (_slow.eq(0) || _standard.eq(0) || _fast.eq(0)) {
        continue
      }
      slow = slow.add(_slow)
      standard = standard.add(_standard)
      fast = fast.add(_fast)
      count++
    }

    slow = slow.div(BigNumber.from(count))
    standard = standard.div(BigNumber.from(count))
    fast = fast.div(BigNumber.from(count))

    const block = await this.web3.eth.getBlock('pending')
    const maxFeePerGas = BigNumber.from(block.baseFeePerGas)

    return {
      fast: this.normalizeItem({ maxFeePerGas, maxPriorityFeePerGas: slow }),
      standard: this.normalizeItem({ maxFeePerGas, maxPriorityFeePerGas: standard }),
      slow: this.normalizeItem({ maxFeePerGas, maxPriorityFeePerGas: fast })
    }
  }

  private normalizeItem (item: any) {
    return {
      maxFeePerGas: item.maxFeePerGas,
      maxPriorityFeePerGas: item.maxPriorityFeePerGas,
      gasPrice: null
    }
  }
}

export class GasService {
  etherchain = new Etherchain()
  etherscan = new Etherscan()
  blocknative = new Blocknative()
  alchemy = new Alchemy()
  logger = new Logger('GasService')

  constructor (chain: string = Chain.Ethereum) {
    if (chain !== Chain.Ethereum) {
      throw new Error('GasService current only supports ethereum')
    }
  }

  getGasFeeData = rateLimitRetry(async (): Promise<GasEstimation> => {
    let result
    try {
      this.logger.debug('fetching etherchain api gas estimates')
      result = await this.etherchain.getGasFeeData()
    } catch (err) {
      this.logger.error('error fetching etherchain api gas estimates:', err)
      try {
        this.logger.debug('fetching etherscan api gas estimates')
        result = await this.etherscan.getGasFeeData()
      } catch (err) {
        this.logger.error('error fetching etherscan api gas estimates', err)
        throw err
      }
    }

    this.sanityCheckResult(result)
    return result
  })

  get1559GasFeeData = rateLimitRetry(async (): Promise<GasEstimation> => {
    let result
    try {
      this.logger.debug('fetching blocknative api gas estimates')
      result = await this.blocknative.getGasFeeData()
    } catch (err) {
      this.logger.error('error fetching blocknative api gas estimates:', err)
      try {
        this.logger.debug('fetching alchemy api gas estimates')
        result = await this.alchemy.getGasFeeData()
      } catch (err) {
        this.logger.error('error fetching alchemy api gas estimates', err)
        throw err
      }
    }

    this.sanityCheckResult(result)
    return result
  })

  private sanityCheckResult (result: GasEstimation) {
    this.sanityCheckItem(result.slow)
    this.sanityCheckItem(result.standard)
    this.sanityCheckItem(result.fast)
  }

  private sanityCheckItem (item: GasFeeData) {
    const minGasPrice = parseUnits('1', 9)
    const minFeePerGas = parseUnits('1', 9)
    const minPriorityFeePerGas = parseUnits('1', 9)
    const maxGasPrice = parseUnits('1000', 9)
    const maxFeePerGas = parseUnits('500', 9)
    const maxPriorityFeePerGas = parseUnits('50', 9)

    if (item.maxFeePerGas) {
      if (item.maxFeePerGas.lt(minFeePerGas)) {
        throw new Error(`invalid maxFeePerGas; must be greater than ${formatUnits(minFeePerGas.toString(), 9)}, received: ${formatUnits(item.maxFeePerGas.toString(), 9)}`)
      }
      if (item.maxFeePerGas.gt(maxFeePerGas)) {
        throw new Error(`invalid maxFeePerGas; must be less than ${formatUnits(maxFeePerGas.toString(), 9)}, received: ${formatUnits(item.maxFeePerGas.toString(), 9)}`)
      }
    }
    if (item.maxPriorityFeePerGas) {
      if (item.maxPriorityFeePerGas.lt(minPriorityFeePerGas)) {
        throw new Error(`invalid maxPriorityFeePerGas; must be greater than ${formatUnits(minPriorityFeePerGas.toString(), 9)}, received: ${formatUnits(item.maxPriorityFeePerGas.toString(), 9)}`)
      }
      if (item.maxPriorityFeePerGas.gt(maxPriorityFeePerGas)) {
        throw new Error(`invalid maxPriorityFeePerGas; must be less than ${formatUnits(maxPriorityFeePerGas.toString(), 9)}, received: ${formatUnits(item.maxPriorityFeePerGas.toString(), 9)}`)
      }
    }
    if (item.gasPrice) {
      if (item.gasPrice.lt(minGasPrice)) {
        throw new Error(`invalid gasPrice; must be greater than ${formatUnits(minGasPrice.toString(), 9)}, received: ${formatUnits(item.gasPrice.toString(), 9)}`)
      }
      if (item.gasPrice.gt(maxGasPrice)) {
        throw new Error(`invalid gasPrice; must be less than ${formatUnits(maxGasPrice.toString(), 9)}, received: ${formatUnits(item.gasPrice.toString(), 9)}`)
      }
    }
  }
}
