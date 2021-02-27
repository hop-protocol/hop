import { useMemo } from 'react'
import { Contract, providers } from 'ethers'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import logger from 'src/logger'
import { L1_NETWORK } from 'src/constants'

const useL1BridgeContracts = (
  provider: providers.Provider,
  token: Token
): Contract | undefined => {
  //logger.debug('useL1BridgeContracts render')

  const l1Bridge = useMemo(() => {
    return new Contract(
      addresses.tokens[token.symbol][L1_NETWORK].l1Bridge,
      l1BridgeArtifact.abi,
      provider
    )
  }, [provider])

  return l1Bridge
}

export default useL1BridgeContracts
