import CoinGecko from './CoinGecko'

class PriceFeed {
  private service = new CoinGecko()

  async getPriceByTokenSymbol (tokenSymbol: string) {
    return this.service.getPriceByTokenSymbol(tokenSymbol)
  }
}

export default PriceFeed
