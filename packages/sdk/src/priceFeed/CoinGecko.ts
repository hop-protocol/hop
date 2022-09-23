import fetch from 'isomorphic-fetch'
import serializeQueryParams from '../utils/serializeQueryParams'
import wait from '../utils/wait'

interface IResult {
  id: string
  symbol: string
  name: string
  image: string
  priceUsd: number
}

class CoinGecko {
  apiKey: string
  private _baseUrl: string = 'https://api.coingecko.com/api/v3'
  private _maxPerPage: number = 100
  private _maxPages: number = 40
  private _tokenSymbolAddressMap: { [key: string]: string } = {
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    ETH: '0x0000000000000000000000000000000000000000',
    GNO: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    HOP: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC'
  }

  constructor (apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey
      this._baseUrl = 'https://pro-api.coingecko.com/api/v3'
    }
  }

  private _nonEthTokens: { [key: string]: string } = {
    BNB: 'Binance Coin',
    SNX: 'Synthetix Network Token'
  }

  public getPriceByTokenSymbol = async (
    symbol: string,
    base: string = 'usd'
  ) => {
    if (symbol === 'ETH') {
      symbol = 'WETH'
    }
    if (['WXDAI', 'XDAI'].includes(symbol)) {
      symbol = 'DAI'
    }
    const prices = await this.getPricesByTokenSymbol([symbol], base)
    return prices[0]
  }

  public getPricesByTokenSymbol = async (
    symbols: string[],
    base: string = 'usd'
  ) => {
    const addresses: string[] = []

    for (let i = 0; i < symbols.length; i++) {
      const address = this._tokenSymbolAddressMap[symbols[i].toUpperCase()]
      if (!address) {
        throw new Error('not found')
      }

      addresses.push(address)
    }

    return this.getPricesByTokenAddresses(addresses, base)
  }

  public getPricesByTokenAddresses = async (
    allAddresses: string[],
    base: string = 'usd'
  ) => {
    let page = 0
    const limit = 100 // max addresses allowed per request
    const allResults: number[] = []

    const getTokens = async (addresses: string[]) => {
      const params = serializeQueryParams({
        contract_addresses: addresses.join(','),
        vs_currencies: base,
        include_market_cap: false,
        include_24hr_vol: false,
        include_24hr_change: false,
        include_last_updated_at: false,
        x_cg_pro_api_key: this.apiKey
      })

      const url = `${this._baseUrl}/simple/token_price/ethereum?${params}`
      const res = await fetch(url)
      const json = await res.json()
      const prices: number[] = []

      for (let i = 0; i < addresses.length; i++) {
        try {
          const address = addresses[i]
          const item = json[address.toLowerCase()]
          if (!item) {
            throw new Error('not found')
          }

          const price = this._normalizePrice(item[base])

          prices.push(price)
        } catch (err) {
          prices.push(null)
        }
      }

      return prices
    }

    while (page * limit < allAddresses.length) {
      const startIdx = page * limit
      const addresses = allAddresses.slice(startIdx, startIdx + limit)
      allResults.push(...(await getTokens(addresses)))
      await wait(250)
      page++
    }

    return allResults
  }

  public getAllTokenPrices = async (base: string = 'usd') => {
    let currentPage = 1
    const allResults: IResult[] = []

    const getTokens = async (page: number) => {
      const params = serializeQueryParams({
        vs_currency: base,
        order: 'market_cap_desc',
        per_page: this._maxPerPage,
        page: page,
        sparkline: false,
        x_cg_pro_api_key: this.apiKey
      })

      const url = `${this._baseUrl}/coins/markets?${params}`
      const res = await fetch(url)
      const json = await res.json()

      if (!Array.isArray(json)) {
        throw new Error('expected array')
      }

      const results: IResult[] = []
      for (let i = 0; i < json.length; i++) {
        const token = json[i]
        try {
          const symbol = token.symbol.toUpperCase()
          if (this._nonEthTokens[symbol]) {
            continue
          }

          results.push({
            id: token.id,
            symbol,
            name: token.name,
            image: token.image,
            priceUsd: this._normalizePrice(token.current_price)
          })
        } catch (err) {
          console.error(err)
        }
      }

      return results
    }

    while (currentPage < this._maxPages) {
      allResults.push(...(await getTokens(currentPage)))
      await wait(250)
      currentPage++
    }

    return allResults
  }

  private _normalizePrice = (price: string | number) => {
    price = Number(price)

    // If the API call did not return a number, throw an error
    if (Number.isNaN(price)) {
      throw new Error('invalid price')
    }

    return price
  }
}

export default CoinGecko
