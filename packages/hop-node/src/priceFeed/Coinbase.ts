import fetch from 'node-fetch'

class Coinbase {
  private baseUrl: string = 'https://api.pro.coinbase.com'

  public getPriceByTokenSymbol = async (symbol: string, base: string = 'USD') => {
    // pair "USDC-USD" doesn't exist so just return $1
    if (symbol === 'USDC') {
      return 1
    }
    const url = `${this.baseUrl}/products/${symbol}-${base}/ticker`
    const res = await fetch(url)
    const json = await res.json()
    const value = json.price
    if (!value) {
      throw new Error('invalid price')
    }

    const price = Number(value)

    if (Number.isNaN(price)) {
      throw new Error('invalid price')
    }

    return price
  }
}

export default Coinbase
