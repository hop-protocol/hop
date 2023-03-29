import { fetchJsonOrThrow } from '../utils/fetchJsonOrThrow'

export class Coinbase {
  private readonly _baseUrl: string = 'https://api.pro.coinbase.com'

  public getPriceByTokenSymbol = async (symbol: string, base: string = 'USD'): Promise<number> => {
    const url = `${this._baseUrl}/products/${symbol}-${base}/ticker`
    const json = await fetchJsonOrThrow(url)
    const value = json.price
    if (!value) {
      if (json.message) {
        throw new Error(`coinbase: "${symbol}": ${json.message}`)
      }
      throw new Error(`coinbase: "${symbol}": invalid price response`)
    }

    const price = Number(value)

    if (Number.isNaN(price)) {
      throw new Error('coinbase: invalid price (not a number)')
    }

    return price
  }
}

export default Coinbase
