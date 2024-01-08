import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getVotes } from './claims'
import { commafy } from 'src/utils/commafy'
import Address from 'src/models/Address'
import shuffle from 'lodash/shuffle'
import { getEnsAddress, getEnsAvatar } from 'src/utils/ens'
import { delegatesJsonUrl, claimChainId } from 'src/pages/Claim/config'
import { networkIdToSlug } from 'src/utils/networks'
import { getProviderByNetworkName } from 'src/utils/getProvider'

const votesCache :any = {}
const addressCache:any = {}
const avatarCache:any = {}
let cached : any[] = []

export function useDelegates() {
  const [delegates, setDelegates] = useState<any[]>(cached || [])
  const { provider, address, connectedNetworkId } = useWeb3Context()
  const [claimProvider, setClaimProvider] = useState<any>(() => {
    return getProviderByNetworkName(networkIdToSlug(claimChainId))
  })

  useEffect(() => {
    const update = async () => {
      if (!provider) {
        return
      }
      if (claimChainId === connectedNetworkId) {
        setClaimProvider(provider)
      } else {
        setClaimProvider(getProviderByNetworkName(networkIdToSlug(claimChainId)))
      }
    }

    update().catch(console.error)
  }, [provider, connectedNetworkId])

  useEffect(() => {
    async function update() {
      if (delegates.length > 0) {
        return
      }
      const res = await fetch(delegatesJsonUrl)
      const json = await res.json()
      const _delegates :any[] = []
      for (const _delegate of json) {
        const delegate : any = {}
        delegate.ensName = _delegate.ensName?.trim()
        delegate.votesFormatted = delegate.votesFormatted || '...'
        delegate.address = null
        delegate.infoUrl = _delegate.infoUrl?.trim()
        delegate.info = _delegate.info
        if (_delegate.address) {
          delegate.address = new Address(_delegate.address?.trim())
        }
        if (_delegate.avatar) {
          delegate.avatar = _delegate.avatar
        }
        _delegates.push(delegate)
      }
      setDelegates(shuffle([..._delegates]))
    }

    update().catch(console.error)
  }, [])

  useEffect(() => {
    async function update() {
      if (Object.keys(addressCache).length > 0) {
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
            addressCache[delegate.ensName] = delegate.address?.address
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
            delegate.votes = BigNumber.from(0)
            getVotes(claimProvider, delegateAddress)
            .then((votes: BigNumber) => {
              votesCache[delegateAddress] = votes
              delegate.votes = votesCache[delegateAddress]
              const votesFormatted = delegate!.votes!.gt(0) ? `${commafy(Number(formatUnits(delegate!.votes!.toString(), 18)), 4)} votes` : '0 votes'
              delegate.votesFormatted = votesFormatted
              setDelegates([...cached])
            })
          } else if (!delegate.votes) {
            delegate.votes = BigNumber.from(0)
          }
          if (votesCache[delegateAddress]) {
            delegate.votes = votesCache[delegateAddress]
          }
          const votesFormatted = '...'
          delegate.votesFormatted = votesFormatted
        } catch (err) {
          console.error('delegates error:', err)
        }
        return delegate
      }))
      cached = [..._delegates]
      setDelegates(cached)
    }

    update().catch(console.error)
  }, [delegates])

  return {
    delegates
  }
}
