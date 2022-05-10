import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getVotes } from 'src/utils/claims'
import { commafy } from 'src/utils/commafy'
import Address from 'src/models/Address'
import { BigNumber } from 'ethers'
import shuffle from 'lodash/shuffle'
import { getEnsAddress, getEnsAvatar, getEnsName } from 'src/utils/ens'

// TODO: replace this with url from airdrop delegates repo
const url = 'https://gist.githubusercontent.com/miguelmota/ca85b07ea6bf0cec934b41656e585e43/raw/7dec8f79e617eecf897edbd2379bb0fab31d90a7/delegates.json'

const votesCache :any = {}
const addressCache:any = {}
const avatarCache:any = {}
let cached : any[] = []

export function useDelegates() {
  const [delegates, setDelegates] = useState<any[]>(cached || [])
  const { provider, address, connectedNetworkId } = useWeb3Context()

  useEffect(() => {
    async function update() {
      if (delegates.length > 0) {
        return
      }
      const res = await fetch(url)
      const json = await res.json()
      const _delegates :any[] = []
      for (const _delegate of json) {
        const delegate : any = {}
        delegate.ensName = _delegate.ensName
        delegate.votesFormatted = delegate.votesFormatted || '...'
        delegate.address = null
        if (_delegate.address) {
          delegate.address = new Address(_delegate.address)
        }
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
      const _delegates = await Promise.all((delegates).map(async (delegate: any) => {
        try {
          if (!delegate.address) {
            if (!addressCache[delegate.ensName]) {
              const address = await getEnsAddress(delegate.ensName)
              addressCache[delegate.ensName] = address
            }
            if (addressCache[delegate.ensName]) {
              delegate.address = new Address(addressCache[delegate.ensName])
            }
          }
          if (!delegate.avatar) {
            if (!avatarCache[delegate.ensName]) {
              const avatar = await getEnsAvatar(delegate.ensName)
              avatarCache[delegate.ensName] = avatar
            }
            if (avatarCache[delegate.ensName]) {
              delegate.avatar = avatarCache[delegate.ensName]
            }
          }
          const delegateAddress = delegate.address?.address
          if (!delegateAddress) {
            return delegate
          }
          if (!votesCache[delegateAddress]) {
            const votes = await getVotes(provider, delegateAddress)
            votesCache[delegateAddress] = votes
          }

          delegate.votes = votesCache[delegateAddress]
          const votesFormatted = delegate!.votes!.gt(0) ? commafy(Number(formatUnits(delegate!.votes!.toString(), 18)), 4) as any : '0'
          delegate.votesFormatted = votesFormatted
        } catch (err) {
          console.error(err)
        }
        return delegate
      }))
      cached = [..._delegates]
      setDelegates(cached)
    }

    update().catch(console.error)
  }, [delegates])

  return {
    delegates: delegates.filter(x => x.address)
  }
}
