import fetch from 'node-fetch'
import serializeQueryParams from 'src/utils/serializeQueryParams'
import wait from 'src/utils/wait'
import { constants } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

type IResult = {
  id: string
  symbol: string
  name: string
  image: string
  priceUsd: number
}

class CoinGecko {
  private readonly _baseUrl: string = 'https://api.coingecko.com/api/v3'
  private readonly _maxPerPage: number = 100
  private readonly _maxPages: number = 40
  private readonly _tokenSymbolAddressMap: { [key: string]: string } = {
    ADT: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
    BAT: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    BLT: '0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e',
    BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    cDAI: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    cSAI: '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC',
    CVC: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    ETH: '0x0000000000000000000000000000000000000000',
    FOAM: '0x4946Fcea7C692606e8908002e55A582af44AC121',
    FUN: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
    GEN: '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf',
    GNO: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    GNT: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    GRID: '0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD',
    HOT: '0x6c6EE5e31d828De241282B9606C8e98Ea48526E2',
    iDAI: '0x14094949152EDDBFcd073717200DA82fEd8dC960',
    KIN: '0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5',
    KNC: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    LOOM: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
    LPT: '0x58b6A8A3302369DAEc383334672404Ee733aB239',
    LQD: '0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4',
    LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    MANA: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    MLN: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
    NEXO: '0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206',
    NMR: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
    PAN: '0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44',
    SAI: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ZRX: '0xE41d2489571d322189246DaFA5ebDe1F4699F498'
  }

  private readonly _nonEthTokens: { [key: string]: string } = {
    BNB: 'Binance Coin',
    CRO: 'Crypto.com Coin',
    BSV: 'Bitcoin SV',
    THETA: 'Theta Network',
    VET: 'VeChain',
    OMG: 'OMG Network',
    CEL: 'Celsius Network',
    SNX: 'Synthetix Network Token',
    RENBTC: 'renBTC',
    DGB: 'DigiByte',
    BTT: 'BitTorrent',
    SC: 'Siacoin',
    BTM: 'Bytom',
    QNT: 'Quant',
    EOS: 'EOS',
    OCEAN: 'Ocean Protocol',
    EGLD: 'Elrond',
    SOL: 'Solana',
    AMPL: 'Ampleforth',
    MANA: 'Decentraland'
  }

  public async getPriceByTokenSymbol (
    symbol: string,
    base: string = 'usd'
  ) {
    if (symbol === 'ETH') {
      symbol = 'WETH'
    }
    if (['WXDAI', 'XDAI'].includes(symbol)) {
      symbol = 'DAI'
    }
    const prices = await this.getPricesByTokenSymbol([symbol], base)
    return prices[0]
  }

  public async getPricesByTokenSymbol (
    symbols: string[],
    base: string = 'usd'
  ) {
    const addresses: string[] = []

    for (let i = 0; i < symbols.length; i++) {
      const address = this._tokenSymbolAddressMap[symbols[i].toUpperCase()]
      if (!address) {
        throw new Error('coingecko: not found')
      }

      addresses.push(address)
    }

    return await this.getPricesByTokenAddresses(addresses, base)
  }

  public async getPricesByTokenAddresses (
    allAddresses: string[],
    base: string = 'usd'
  ) {
    let page = 0
    const limit = 100 // max addresses allowed per request
    const allResults: Array<number | null> = []

    const getTokens = async (addresses: string[]) => {
      const params = serializeQueryParams({
        contract_addresses: addresses.join(','),
        vs_currencies: base,
        include_market_cap: false,
        include_24hr_vol: false,
        include_24hr_change: false,
        include_last_updated_at: false
      })

      const url = `${this._baseUrl}/simple/token_price/ethereum?${params}`
      const res = await fetch(url)
      const json = await res.json()
      const prices: Array<number | null> = []

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        try {
          const item = json[address.toLowerCase()]
          if (!item) {
            throw new Error('coingecko: not found')
          }

          const price = this._normalizePrice(item[base])

          prices.push(price)
        } catch (err) {
          if (address === constants.AddressZero) {
            const id = 'ethereum'
            const params = serializeQueryParams({
              ids: id,
              vs_currencies: base,
              include_market_cap: false,
              include_24hr_vol: false,
              include_24hr_change: false,
              include_last_updated_at: false
            })
            const url = `${this._baseUrl}/simple/price?${params}`
            const res = await fetch(url)
            const json = await res.json()
            const item = json[id]
            if (!item) {
              prices.push(null)
              continue
            }

            const price = this._normalizePrice(item[base])
            prices.push(price)
          } else {
            prices.push(null)
          }
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

  public async getAllTokenPrices (base: string = 'usd') {
    let currentPage = 1
    const allResults: IResult[] = []

    const getTokens = async (page: number) => {
      const params = serializeQueryParams({
        vs_currency: base,
        order: 'market_cap_desc',
        per_page: this._maxPerPage,
        page: page,
        sparkline: false
      })

      const url = `${this._baseUrl}/coins/markets?${params}`
      const res = await fetch(url)
      const json = await res.json()

      if (!Array.isArray(json)) {
        throw new Error('coingecko: expected array')
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

  public async getTokenInfoById (id: string) {
    const params = serializeQueryParams({
      sparkline: false,
      market_data: false,
      community_data: false,
      developer_data: false
    })

    const url = `${this._baseUrl}/coins/${id}?${params}`
    const res = await fetch(url)
    const json = await res.json()

    if (!json.symbol) {
      throw new Error('coingecko: invalid response')
    }

    const result = {
      name: json.name,
      symbol: json.symbol.toUpperCase(),
      contractAddress: getAddress(json.contract_address)
    }

    return result
  }

  private readonly _normalizePrice = (price: string | number) => {
    price = Number(price)

    // If the API call did not return a number, throw an error
    if (Number.isNaN(price)) {
      throw new Error('coinbase: invalid price (not a number)')
    }

    return price
  }
}

export default CoinGecko
