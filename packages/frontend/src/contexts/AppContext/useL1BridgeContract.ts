import { useMemo } from 'react'
import { providers } from 'ethers'
import { L1Bridge, L1Bridge__factory } from '@hop-protocol/core/contracts'
import { addresses } from 'src/config'
import Token from 'src/models/Token'
import { L1_NETWORK } from 'src/utils/constants'

const useL1BridgeContracts = (provider: providers.Provider, token: Token): L1Bridge | undefined => {
  // logger.debug('useL1BridgeContracts render')

  const l1Bridge = useMemo(() => {
    if (token.symbol && addresses.tokens[token.symbol]?.[L1_NETWORK]?.l1Bridge) {
      return L1Bridge__factory.connect(
        addresses.tokens[token.symbol]?.[L1_NETWORK]?.l1Bridge as string,
        provider
      )
    }
  }, [provider])

  return l1Bridge
}

export default useL1BridgeContracts
