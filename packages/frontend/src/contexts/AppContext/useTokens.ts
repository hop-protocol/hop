import { useMemo } from 'react'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses, metadata } from 'src/config'
import { TokenSymbol } from '@hop-protocol/sdk'

const useTokens = (networks: Network[]) => {
  const tokens = useMemo<Token[]>(() => {
    return Object.keys(addresses.tokens).map(tokenSymbol => {
      const canonicalSymbol = ['WETH', 'WMATIC', 'XDAI'].includes(tokenSymbol)
        ? tokenSymbol.replace(/^W/, '')
        : tokenSymbol
      const tokenMeta = metadata.tokens[canonicalSymbol]
      const supportedNetworks = Object.keys(addresses.tokens[canonicalSymbol])
      return new Token({
        symbol: tokenMeta.symbol as TokenSymbol,
        tokenName: tokenMeta.name,
        decimals: tokenMeta.decimals,
        imageUrl: tokenMeta.image,
        supportedNetworks,
      })
    })
  }, [])

  return tokens
}

export default useTokens
