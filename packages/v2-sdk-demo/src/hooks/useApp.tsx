import { useMemo, useState, useEffect } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { useLocalStorageState } from '../hooks/useLocalStorageState.js'

export function useApp() {
  const [network, setNetwork] = useLocalStorageState('network', {
    defaultValue: 'sepolia'
  })

  const [sdk, setSdk] = useState(() => {
    return new Hop({
      network,
      signersOrProviders: Hop.getDefaultProviders(network)
    })
  })

  useEffect(() => {
    setSdk(new Hop({
      network,
      signersOrProviders: Hop.getDefaultProviders(network)
    }))
  }, [network])

  useEffect(() => {
    (window as any).sdk = sdk
  }, [sdk])


  const chainIds = useMemo(() => {
    if (network === 'mainnet') {
      return ['1', '10', '8453', '42161']
    }
    if (network === 'sepolia') {
      return ['11155420', '11155111', '84532', '42069']
    }

    return []
  }, [network])

  const defaultChainIds = {
    from: chainIds[0],
    to: chainIds[1]
  }

  return {
    network,
    setNetwork,
    sdk,
    chainIds,
    defaultChainIds
  }
}
