import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import { erc20Abi } from '@hop-protocol/abi'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses, metadata } from 'src/config'
import { L1_NETWORK } from 'src/constants'

type Contracts = {
  [key: string]: {
    [key: string]: Contract
  }
}

const useTokens = (networks: Network[]) => {
  const tokens = useMemo<Token[]>(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      const tokenMeta = metadata.tokens[symbol]
      const supportedNetworks = Object.keys(addresses.tokens[symbol])
      return new Token({
        symbol: tokenMeta.symbol,
        tokenName: tokenMeta.name,
        decimals: tokenMeta.decimals,
        imageUrl: tokenMeta.image,
        supportedNetworks
      })
    })
  }, [])

  return tokens
}

export default useTokens
