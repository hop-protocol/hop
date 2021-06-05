import { useMemo } from 'react'
import { Hop } from '@hop-protocol/sdk'
import { addresses } from 'src/config'

const useBridges = (sdk: Hop) => {
  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol)
    })
  }, [sdk])

  return bridges
}

export default useBridges
