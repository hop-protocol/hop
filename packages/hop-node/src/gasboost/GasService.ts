import fetch from 'node-fetch'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { BigNumber } from 'ethers'
import { blocknativeApiKey, etherscanEthereumApiKey } from 'src/config'
import { parseUnits } from 'ethers/lib/utils'

type GasFeeData = {
  maxFeePerGas: BigNumber | null
  maxPriorityFeePerGas: BigNumber | null
  gasPrice: BigNumber | null
}

type GasEstimation = {
  rapid: GasFeeData
  fast: GasFeeData
  standard: GasFeeData
  slow: GasFeeData
}

class Etherchain {
  baseUrl: string = 'https://etherchain.org/api'

  async getGas (): Promise<GasEstimation> {
    const url = `${this.baseUrl}/gasnow`
    const res = await fetch(url)
    const json = await res.json()
    const result = json.data
    return {
      rapid: this.normalizeItem(result.rapid),
      fast: this.normalizeItem(result.fast),
      standard: this.normalizeItem(result.standard),
      slow: this.normalizeItem(result.slow)
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

  async getGas (): Promise<GasEstimation> {
    const url = `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${etherscanEthereumApiKey}`
    const res = await fetch(url)
    const json = await res.json()
    const result = json.result
    return {
      rapid: this.normalizeItem(result.FastGasPrice),
      fast: this.normalizeItem(result.ProposeGasPrice),
      standard: this.normalizeItem(result.SafeGasPrice),
      slow: this.normalizeItem(result.suggestBaseFee)
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

  async getGas (): Promise<GasEstimation> {
    const url = `${this.baseUrl}/gasprices/blockprices`
    const res = await fetch(url, {
      headers: {
        Authorization: blocknativeApiKey!
      }
    })
    const json = await res.json()
    const result = json
    const { estimatedPrices } = result.blockPrices[0]
    return {
      rapid: this.normalizeItem(estimatedPrices[0]),
      fast: this.normalizeItem(estimatedPrices[1]),
      standard: this.normalizeItem(estimatedPrices[2]),
      slow: this.normalizeItem(estimatedPrices[3])
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

export class GasService {
  etherchain = new Etherchain()
  etherscan = new Etherscan()
  blocknative = new Blocknative()

  getGas = rateLimitRetry(async (): Promise<GasEstimation> => {
    return this.blocknative.getGas()
  })
}
