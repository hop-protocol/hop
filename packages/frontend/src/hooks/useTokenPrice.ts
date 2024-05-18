import { stableCoins } from '#utils/constants.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useQuery } from 'react-query'

export function useTokenPrice(tokenSymbol: string) {
  const { sdk } = useApp()
  const { data: priceUsd } = useQuery(
    [
      `tokenPrice:${tokenSymbol}`,
      tokenSymbol
    ],
    async () => {
      const bridge = sdk.bridge('ETH')
      return stableCoins.has(tokenSymbol) ? 1 : bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
    },
    {
      enabled: !!tokenSymbol,
      refetchInterval: 60 * 1000,
    }
  )

  return {
    tokenSymbol,
    priceUsd
  }
}
