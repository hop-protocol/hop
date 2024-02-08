import fetch from 'isomorphic-fetch'
import { CoingeckoApiKey } from './config'
import { tokens } from '@hop-protocol/core/metadata'

function getCoinId (tokenSymbol: string) {
  return (tokens as any)[tokenSymbol]?.coingeckoId
}

export async function getPriceHistory (tokenSymbol: string, days: number) {
  const coinId = getCoinId(tokenSymbol)
  if (!coinId) {
    throw new Error(`coingecko coin id not found for token "${tokenSymbol}"`)
  }

  const url = `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily&x_cg_pro_api_key=${CoingeckoApiKey}`
  console.log(url)
  return Promise.race([fetch(url)
    .then(async (res: any) => {
      if (res.status > 400) {
        throw await res.text()
      }
      return res.json()
    })
    .then((json: any) => {
      console.log('fetched', coinId)
      console.log('debug', JSON.stringify(json))
      return json.prices.map((data: any[]) => {
        data[0] = Math.floor(data[0] / 1000)
        return data
      })
    }),
  new Promise((resolve: any, reject) => {
    setTimeout(() => reject(new Error('request timeout: ' + url)), 2 * 60 * 1000)
  })
  ])
}
