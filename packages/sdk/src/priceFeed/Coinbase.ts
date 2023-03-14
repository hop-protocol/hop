import { fetchJsonOrThrow } from '../utils/fetchJsonOrThrow'

class Coinbase {
  private readonly _baseUrl: string = 'https://api.pro.coinbase.com'

  public getPriceByTokenSymbol = async (symbol: string, base: string = 'USD'): Promise<number> => {
    // pair "USDC-USD" doesn't exist so just return $1
    if (symbol === 'USDC') {
      return 1
    }
    const url = `${this._baseUrl}/products/${symbol}-${base}/ticker`
    const json = await fetchJsonOrThrow(url)
    const value = json.price
    if (!value) {
      throw new Error('coinbase: invalid price response')
    }

    const price = Number(value)

    if (Number.isNaN(price)) {
      throw new Error('coinbase: invalid price (not a number)')
    }

    return price
  }
}

export default Coinbase
