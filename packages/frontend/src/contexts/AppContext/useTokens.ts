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
  //logger.debug('useTokens render')
  const getErc20Contract = (
    address: string,
    provider: Signer | providers.Provider
  ): Contract => {
    return new Contract(
      address,
      erc20Abi,
      provider as providers.Provider
    ) as Contract
  }

  const contracts = useMemo<Contracts>(() => {
    return Object.keys(addresses.tokens).reduce((acc, symbol) => {
      acc[symbol] = Object.keys(addresses.tokens[symbol]).reduce(
        (obj, networkSlug) => {
          const network = networks.find(network => network.slug === networkSlug)
          if (!network) {
            return obj
          }
          const config = addresses.tokens[symbol][networkSlug]
          const { provider } = network
          if (networkSlug === L1_NETWORK) {
            obj[networkSlug] = getErc20Contract(
              config.l1CanonicalToken,
              provider
            )
            return obj
          }
          obj[networkSlug] = getErc20Contract(config.l2CanonicalToken, provider)
          obj[`${networkSlug}HopBridge`] = getErc20Contract(
            config.l2HopBridgeToken,
            provider
          )
          return obj
        },
        {} as { [key: string]: Contract }
      )
      return acc
    }, {} as Contracts)
  }, [networks])

  const tokens = useMemo<Token[]>(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      const tokenMeta = metadata.tokens[symbol]
      const supportedNetworks = Object.keys(addresses.tokens[symbol])
      return new Token({
        symbol: tokenMeta.symbol,
        tokenName: tokenMeta.name,
        decimals: tokenMeta.decimals,
        contracts: contracts[symbol],
        imageUrl: tokenMeta.image,
        supportedNetworks
      })
    })
  }, [contracts])

  return tokens
}

export default useTokens
