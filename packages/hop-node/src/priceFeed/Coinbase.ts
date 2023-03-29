import fetch from 'node-fetch'

class Coinbase {
  private readonly baseUrl: string = 'https://api.pro.coinbase.com'

  public async getPriceByTokenSymbol (symbol: string, base: string = 'USD'): Promise<number> {
    const url = `${this.baseUrl}/products/${symbol}-${base}/ticker`
    const res = await fetch(url)
    const json = await res.json()
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
