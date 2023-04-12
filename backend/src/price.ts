import fetch from 'isomorphic-fetch'

export async function getPriceHistory (coinId: string, days: number) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
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
