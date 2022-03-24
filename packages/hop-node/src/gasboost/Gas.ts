import fetch from 'node-fetch'
import { BigNumber } from 'ethers'
import { etherscanEthereumApiKey } from 'src/config'
import { parseUnits } from 'ethers/lib/utils'

class Etherchain {
  baseUrl: string = 'https://etherchain.org/api'

  async getGas () {
    const url = `${this.baseUrl}/gasnow`
    const res = await fetch(url)
    const json = await res.json()
    const result = json.data
    return {
      rapid: BigNumber.from(result.rapid),
      fast: BigNumber.from(result.fast),
      standard: BigNumber.from(result.standard),
      slow: BigNumber.from(result.slow)
    }
  }
}

class Etherscan {
  baseUrl: string = 'https://api.etherscan.io/api'

  async getGas () {
    const url = `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${etherscanEthereumApiKey}`
    const res = await fetch(url)
    const json = await res.json()
    const result = json.result
    return {
      rapid: parseUnits(result.FastGasPrice.toString(), 9),
      fast: parseUnits(result.ProposeGasPrice.toString(), 9),
      standard: parseUnits(result.SafeGasPrice.toString(), 9),
      slow: parseUnits(result.suggestBaseFee.toString(), 9)
    }
  }

  async getTimeEstimation (gasPrice: string) {
    const url = `${this.baseUrl}?module=gastracker&action=gasestimate&gasprice=${gasPrice}&apikey=${etherscanEthereumApiKey}`
    const res = await fetch(url)
    const json = await res.json()
    return json.result
  }
}

export class Gas {
  etherchain = new Etherchain()
  etherscan = new Etherscan()

  async getGas () {
    try {
      return await this.etherchain.getGas()
    } catch (err) {
      console.error('etherchain api error', err)
      console.log('trying etherscan api')
      return await this.etherscan.getGas()
    }
  }
}
