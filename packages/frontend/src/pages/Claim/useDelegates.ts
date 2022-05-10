import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getVotes } from 'src/utils/claims'
import { commafy } from 'src/utils/commafy'
import Address from 'src/models/Address'
import { BigNumber } from 'ethers'
import shuffle from 'lodash/shuffle'

// TODO: replace this with url from airdrop delegates repo
const url = 'https://gist.githubusercontent.com/miguelmota/ca85b07ea6bf0cec934b41656e585e43/raw/e635e68d958d05d91d90b6322d9e637f93eeba5f/delegates.json'

const votesCache :any = {}

export function useDelegates() {
  const [delegates, setDelegates] = useState<any[]>([])
  const { provider, address, connectedNetworkId } = useWeb3Context()

  useEffect(() => {
    async function update() {
      const res = await fetch(url)
      const json = await res.json()
      const _delegates :any[] = []
      for (const _delegate of json) {
        const delegate : any = {}
        delegate.ensName = _delegate.ensName
        delegate.avatar = _delegate.avatar
        const delegateAddress = _delegate.address
        if (!delegateAddress) {
          continue
        }
        delegate.votesFormatted = delegate.votesFormatted || '...'
        delegate.address = new Address(_delegate.address)
        _delegates.push(delegate)
      }
      setDelegates(shuffle([..._delegates]))
    }

    update().catch(console.error)
  }, [])

  useEffect(() => {
    async function update() {
      if (Object.keys(votesCache).length > 0) {
        return
      }
      for (const delegate of delegates) {
        const delegateAddress = delegate.address?.address
        if (!votesCache[delegateAddress]) {
          const votes = await getVotes(provider, delegateAddress)
          votesCache[delegateAddress] = votes
        }
        delegate.votes = votesCache[delegateAddress]
        const votesFormatted = delegate!.votes!.gt(0) ? commafy(Number(formatUnits(delegate!.votes!.toString(), 18)), 4) as any : '0'
        delegate.votesFormatted = votesFormatted
        setDelegates([...delegates])
      }
    }

    update().catch(console.error)
  }, [delegates])

  return {
    delegates
  }
}
