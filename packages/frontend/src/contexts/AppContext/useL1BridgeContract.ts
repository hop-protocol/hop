import { useMemo } from 'react'
import { Contract, providers } from 'ethers'
import { l1BridgeAbi } from '@hop-protocol/core/abi'
import { addresses } from 'src/config'
import Token from 'src/models/Token'
import { L1_NETWORK } from 'src/constants'

const useL1BridgeContracts = (
  provider: providers.Provider,
  token: Token
): Contract | undefined => {
  // logger.debug('useL1BridgeContracts render')

  const l1Bridge = useMemo(() => {
    return new Contract(
      (addresses.tokens[token.symbol][L1_NETWORK] as any).l1Bridge,
      l1BridgeAbi,
      provider
    )
  }, [provider])

  return l1Bridge
}

export default useL1BridgeContracts
