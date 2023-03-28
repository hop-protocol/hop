import { fetchJsonOrThrow } from '../utils/fetchJsonOrThrow'

export class Coinpaprika {
  private readonly _baseUrl: string = 'https://api.coinpaprika.com/v1'
  idMap:any = {
    BTC: 'btc-bitcoin',
    DAI: 'dai-dai',
    ETH: 'eth-ethereum',
    GNO: 'gno-gnosis',
    HOP: 'hop-hop-protocol',
    MATIC: 'matic-polygon',
    RETH: 'reth-rocket-pool-eth',
    SNX: 'snx-synthetix-network-token',
    SUSD: 'susd-susd',
    TUSD: 'tusd-trueusd',
    USDC: 'usdc-usd-coin',
    USDT: 'usdt-tether'
  }

  public getPriceByTokenSymbol = async (symbol: string, base: string = 'USD'): Promise<number> => {
    symbol = symbol.toUpperCase()
    if (symbol === 'WBTC') {
      symbol = 'BTC'
    }
    if (symbol === 'WETH') {
      symbol = 'ETH'
    }
    if (symbol === 'WMATIC') {
      symbol = 'MATIC'
    }
    if (symbol === 'XDAI') {
      symbol = 'DAI'
    }
    if (symbol === 'WXDAI') {
      symbol = 'DAI'
    }
    const id = this.idMap[symbol]
    if (!id) {
      throw new Error(`id mapping not found for "${symbol}"`)
    }
    const url = `${this._baseUrl}/tickers/${id}`
    const json = await fetchJsonOrThrow(url)
    const value = json?.quotes?.[base]?.price
    if (!value) {
      if (json.error) {
        throw new Error(`coinpaprika: "${symbol}": ${json.error}`)
      }
      throw new Error(`coinpaprika: "${symbol}": invalid price response`)
    }

    const price = Number(value)

    if (Number.isNaN(price)) {
      throw new Error('coinpaprika: invalid price (not a number)')
    }

    return price
  }
}

export default Coinpaprika
