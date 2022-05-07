import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { delegates as json } from './data'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getVotes } from 'src/utils/claims'
import { commafy } from 'src/utils/commafy'

const votesCache :any = {}

export function useDelegates() {
  const [delegates, setDelegates] = useState<any[]>(json)
  const { provider, address, connectedNetworkId } = useWeb3Context()

  useEffect(() => {
    async function update() {
      for (const delegate of json) {
        const delegateAddress = delegate.address
        if (!delegateAddress) {
          continue
        }
        if (!votesCache[delegateAddress]) {
          const votes = await getVotes(provider, delegateAddress)
          const votesFormatted = commafy(Number(formatUnits(votes.toString(), 18)), 4) as any
          votesCache[delegateAddress] = votesFormatted
        }
        delegate.votes = votesCache[delegateAddress]
        setDelegates([...delegates])
      }
    }

    update().catch(console.error)
  }, [])

  return {
    delegates
  }
}
