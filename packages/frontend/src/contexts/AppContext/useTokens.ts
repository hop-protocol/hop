import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses } from 'src/config'
import logger from 'src/logger'

const useTokens = (networks: Network[]) => {
  //logger.debug('useTokens render')
  const getErc20Contract = (
    address: string,
    provider: Signer | providers.Provider
  ): Contract => {
    return new Contract(address, erc20Artifact.abi, provider) as Contract
  }

  const contracts = Object.keys(addresses.tokens).reduce((acc, symbol) => {
    acc[symbol] = Object.keys(addresses.tokens[symbol]).reduce(
      (obj, networkSlug) => {
        const network = networks.find(network => network.slug === networkSlug)
        if (!network) {
          return obj
        }
        if (networkSlug === 'kovan') {
          obj[networkSlug] = getErc20Contract(
            addresses.tokens[symbol][networkSlug].l1CanonicalToken,
            network.provider
          )
          return obj
        }
        obj[networkSlug] = getErc20Contract(
          addresses.tokens[symbol][networkSlug].l2CanonicalToken,
          network.provider
        )
        obj[`${networkSlug}HopBridge`] = getErc20Contract(
          addresses.tokens[symbol][networkSlug].l2Bridge,
          network.provider
        )
        return obj
      },
      {} as any
    )
    return acc
  }, {} as any)

  const tokens = useMemo<Token[]>(() => {
    return [
      new Token({
        symbol: 'DAI',
        tokenName: 'DAI Stablecoin',
        contracts: contracts['DAI']
      }),
      new Token({
        symbol: 'ARB',
        tokenName: 'ARB Token',
        contracts: contracts['ARB']
      })
    ]
  }, [contracts])

  return tokens
}

export default useTokens
