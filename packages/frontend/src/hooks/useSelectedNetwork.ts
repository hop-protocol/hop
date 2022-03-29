import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import Network from 'src/models/Network'
import { defaultL2Network, l2Networks } from 'src/config/networks'
import { findNetworkBySlug, networkIdToSlug, networkSlugToId } from 'src/utils'
import useQueryParams from './useQueryParams'
import { SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import { ChainSlug } from '@hop-protocol/sdk'

interface Options {
  l2Only?: boolean
  availableNetworks?: Network[]
  gnosisSafe?: SafeInfo
}

export function useSelectedNetwork(opts: Options = { l2Only: false }) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(defaultL2Network)
  const { queryParams, updateQueryParams } = useQueryParams()

  useEffect(() => {
    if (queryParams?.sourceNetwork !== selectedNetwork.slug) {
      const matchingNetwork = findNetworkBySlug(
        queryParams.sourceNetwork as string,
        opts.availableNetworks
      )
      if (matchingNetwork && !matchingNetwork.isLayer1) {
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

  const isMatchingSignerAndSourceChainNetwork = useMemo(() => {
    if (queryParams?.sourceNetwork) {
      const chainId = networkSlugToId(queryParams.sourceNetwork as ChainSlug)
      if (opts.gnosisSafe?.chainId === chainId) {
        return true
      }
    }
    return false
  }, [opts, queryParams])

  const selectSourceNetwork = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug, opts.availableNetworks)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        sourceNetwork: network.slug,
      })
    }
  }

  const selectDestNetwork = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug, opts.availableNetworks)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        destNetwork: network.slug,
      })
    }
  }

  const selectBothNetworks = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug, opts.availableNetworks)
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
    isMatchingSignerAndSourceChainNetwork,
  }
}
