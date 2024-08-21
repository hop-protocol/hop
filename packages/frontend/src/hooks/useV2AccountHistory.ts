import { useState } from 'react'
import useQueryParams from '#hooks/useQueryParams.js'
import { reactAppNetwork, v2ExplorerBaseUrl } from '#config/index.js'
import { useQuery } from 'react-query'
import { NetworkSlug } from '@hop-protocol/sdk'

type Props = {
  address: string
}

export function useV2AccountHistory(props) {
  const { queryParams } = useQueryParams()
  const address = queryParams.address ?? props.address
  const [perPage] = useState<number>(5)
  const [page, setPage] = useState<number>(1)

  const queryKey = `v2AccountTransfersHistory:${address}:${perPage}:${page}`
  const { isLoading, data, error } = useQuery(
    [queryKey, address, page, perPage],
    async () => {
      if (!address) {
        return []
      }
      if (reactAppNetwork !== NetworkSlug.Sepolia) {
        return []
      }
      const url = `${v2ExplorerBaseUrl}/v1/explorer?filter[account]=${address}&limit=${perPage}&page=${page}`
      const res = await fetch(url)
      const json = await res.json()
      const hasNextPage = json.hasNextPage
      const transfers = json.events
      if (!Array.isArray(transfers)) {
        return []
      }
      return {
        transfers,
        hasNextPage
      }
    },
    {
      enabled: !!address,
      refetchInterval: 10 * 1000,
    }
  )

  function handleNextPageClick(event: any) {
    event.preventDefault()
    setPage(page + 1)
  }

  function handlePreviousPageClick(event: any) {
    event.preventDefault()
    if (page > 1) {
      setPage(Math.max(page - 1, 1))
    }
  }

  const hasPreviousPage = page > 1

  const events = (data as any)?.transfers ?? []
  const hasNextPage = (data as any)?.hasNextPage ?? false

  return {
    isLoading,
    data: events,
    error,
    page,
    setPage,
    hasPreviousPage,
    hasNextPage,
    handleNextPageClick,
    handlePreviousPageClick
  }
}
