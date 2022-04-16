import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import Chain from 'src/models/Chain'
import { defaultL2Network, l2Networks } from 'src/config/networks'
import { findNetworkBySlug, networkIdToSlug, networkSlugToId } from 'src/utils'
import useQueryParams from './useQueryParams'
import { SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import { ChainSlug } from '@hop-protocol/sdk'

interface Options {
  l2Only?: boolean
  availableNetworks?: Chain[]
  gnosisSafe?: SafeInfo
}

export function useSelectedNetwork(opts: Options = { l2Only: false }) {
  const [selectedNetwork, setSelectedNetwork] = useState<Chain>(defaultL2Network)
  const { queryParams, updateQueryParams } = useQueryParams()

  useEffect(() => {
    if (queryParams?.sourceChain !== selectedNetwork.slug) {
      const matchingNetwork = findNetworkBySlug(
        queryParams.sourceChain as string,
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
    if (queryParams?.sourceChain) {
      const chainId = networkSlugToId(queryParams.sourceChain as ChainSlug)
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
        sourceChain: network.slug,
      })
    }
  }

  const selectDestNetwork = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug, opts.availableNetworks)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        destinationChain: network.slug,
      })
    }
  }

  const selectBothNetworks = (event: ChangeEvent<{ value: any }>) => {
    const selectedNetworkSlug = event.target.value
    const network = findNetworkBySlug(selectedNetworkSlug, opts.availableNetworks)
    if (network) {
      setSelectedNetwork(network)
      updateQueryParams({
        sourceChain: network.slug,
        destinationChain: network.slug,
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
