import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import React, { useEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { ExternalLink } from '#components/Link/index.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { isMainnet, reactAppNetwork } from '#config/index.js'
import { useQuery } from 'react-query'
import { useTheme } from '@mui/material/styles'
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
      const baseUrl = `http://localhost:8000` // TODO: move to config
      const url = `${baseUrl}/v1/explorer?filter[account]=${address}&limit=${perPage}&page=${page}`
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
