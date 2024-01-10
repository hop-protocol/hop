import { stableCoins } from 'src/utils/constants'
import { useApp } from 'src/contexts/AppContext'
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
      if (stableCoins.has(tokenSymbol)) {
        return 1
      }

      const price = await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
      return price!
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
