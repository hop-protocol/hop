import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { delegates as json } from './data'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getVotes } from 'src/utils/claims'
import { commafy } from 'src/utils/commafy'
import Address from 'src/models/Address'
import { BigNumber } from 'ethers'
import shuffle from 'lodash/shuffle'

const votesCache :any = {}

export function useDelegates() {
  const [delegates, setDelegates] = useState<any[]>([])
  const { provider, address, connectedNetworkId } = useWeb3Context()

  useEffect(() => {
    async function update() {
      const _delegates :any[] = []
      for (const _delegate of json) {
        const delegate : any = {}
        delegate.ensName = _delegate.ensName
        delegate.avatar = _delegate.avatar
        const delegateAddress = _delegate.address
        if (!delegateAddress) {
          continue
        }
        if (!votesCache[delegateAddress]) {
          //const votes = await getVotes(provider, delegateAddress)
          votesCache[delegateAddress] = BigNumber.from(0) // votes
        }
        delegate.votes = votesCache[delegateAddress]
        const votesFormatted = delegate!.votes!.gt(0) ? commafy(Number(formatUnits(delegate!.votes!.toString(), 18)), 4) as any : '0'
        delegate.votesFormatted = votesFormatted
        delegate.address = new Address(_delegate.address)
        _delegates.push(delegate)
      }
      setDelegates(shuffle([..._delegates]))
    }

    update().catch(console.error)
  }, [])

  return {
    delegates
  }
}
