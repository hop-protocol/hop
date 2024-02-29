import { fetchJsonOrThrow } from './utils/fetchJsonOrThrow.js'

interface GasFeeDataResponse {
  status: string
  data: {
    expiration: number
    chainSlug: string
    timestamp: number
    blockNumber: number
    feeData: {
      baseFeePerGas: string
      l1BaseFee?: string
    }
  }
}

interface GasPriceVerifyResponse {
  status: string
  data: {
    valid: boolean
    timestamp: number
    gasPrice: string
    minBaseFeePerGasFee: string
    minBaseFeePerGasBlockNumber: number
    minBaseFeePerGasTimestamp: number
  }
}

interface GasCostEstimateResponse {
  status: string
  data: {
    l1Fee: string
    l2Fee: string
    gasCost: string
  }
}

interface GasCostEstimateVerifyResponse {
  status: string
  data: {
    valid: boolean
    timestamp: number
    targetGasCost: string
    minGasCostEstimate: string
    minGasFeeDataBlockNumber: number
    minGasFeeDataTimestamp: number
    minGasFeeDataBaseFeePerGas: string
    minGasFeeDataL1BaseFee: string
  }
}

export class GasPriceOracle {
  baseURL: string

  constructor (networkOrBaseURL: string) {
    if (networkOrBaseURL.startsWith('http')) {
      this.baseURL = networkOrBaseURL
    }

    if (networkOrBaseURL === 'goerli') {
      const url = 'https://v2-gas-price-oracle-goerli.hop.exchange'
      this.baseURL = url
    }
  }

  async getGasFeeData (chain: string, timestamp?: number): Promise<GasFeeDataResponse> {
    const url = new URL(`${this.baseURL}/v1/gas-fee-data`)
    url.searchParams.append('chain', chain)
    if (timestamp) {
      url.searchParams.append('timestamp', timestamp.toString())
    }

    const json = await fetchJsonOrThrow(url.toString())
    return json
  }

  async verifyGasPrice (chain: string, timestamp: number, gasPrice: string): Promise<GasPriceVerifyResponse> {
    const url = new URL(`${this.baseURL}/v1/gas-price-verify`)
    url.searchParams.append('chain', chain)
    url.searchParams.append('timestamp', timestamp.toString())
    url.searchParams.append('gasPrice', gasPrice)

    const json = await fetchJsonOrThrow(url.toString())
    return json
  }

  async estimateGasCost (chain: string, timestamp: number, gasLimit: number, txData: string): Promise<GasCostEstimateResponse> {
    const url = new URL(`${this.baseURL}/v1/gas-cost-estimate`)
    url.searchParams.append('chain', chain)
    if (timestamp) {
      url.searchParams.append('timestamp', timestamp.toString())
    }
    url.searchParams.append('gasLimit', gasLimit.toString())
    url.searchParams.append('txData', txData)
    console.log('url:', url.toString())

    const json = await fetchJsonOrThrow(url.toString())
    return json
  }

  async verifyGasCostEstimate (chain: string, timestamp: number, gasLimit: number, txData: string, targetGasCost: string): Promise<GasCostEstimateVerifyResponse> {
    const url = new URL(`${this.baseURL}/v1/gas-cost-estimate-verify`)
    url.searchParams.append('chain', chain)
    if (timestamp) {
      url.searchParams.append('timestamp', timestamp.toString())
    }
    url.searchParams.append('gasLimit', gasLimit.toString())
    url.searchParams.append('txData', txData.toString())
    url.searchParams.append('targetGasCost', targetGasCost.toString())
    console.log('url:', url.toString())

    const json = await fetchJsonOrThrow(url.toString())
    return json
  }
}
