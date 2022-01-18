import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import { Addressish } from 'src/models/Address'
import { useQueryParams } from '.'
import { ChangeEvent, useEffect, useState } from 'react'
import { defaultL2Network, l2Networks } from 'src/config/networks'
import { findNetworkBySlug } from 'src/utils'

async function fetchBalance(token: Token, address: Addressish) {
  return token.balanceOf(address?.toString())
}

interface Options {
  l2Only: boolean
}

export function useSelectedNetwork(opts: Options = { l2Only: false }) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(defaultL2Network)
  const { queryParams, updateQueryParams } = useQueryParams()

  useEffect(() => {
    if (queryParams?.sourceNetwork !== selectedNetwork.slug) {
      const matchingNetwork = findNetworkBySlug(queryParams.sourceNetwork)
      if (matchingNetwork && !matchingNetwork?.isLayer1) {
        setSelectedNetwork(matchingNetwork)
      } else {
        setSelectedNetwork(defaultL2Network)
      }
    }
  }, [queryParams])

  useEffect(() => {
    if (opts.l2Only && selectedNetwork && !l2Networks.includes(selectedNetwork)) {
      setSelectedNetwork(defaultL2Network)
    }
  }, [opts.l2Only])

  const selectSourceNetwork = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        sourceNetwork: network.slug,
      })
    }
  }

  const selectDestNetwork = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        destNetwork: network.slug,
      })
    }
  }

  const selectBothNetworks = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        sourceNetwork: network.slug,
        destNetwork: network.slug,
      })
    }
  }

  return {
    selectedNetwork,
    selectSourceNetwork,
    selectDestNetwork,
    selectBothNetworks,
  }
}
