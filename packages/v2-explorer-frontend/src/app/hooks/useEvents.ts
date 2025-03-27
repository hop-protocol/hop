import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { fetchEvents } from './fetchEvents'

export function useEvents (eventName: string, filter: any = {}, onPagination?: any, queryParams?: any) {
  const [hasNextPage, setHasNextPage] = useState(false)
  const [page, setPage] = useState(queryParams?.page || 1)
  const [limit, setLimit] = useState(queryParams?.limit || 10)
  const intervalMs = 10 * 1000

  const filterString = useMemo(() => {
    let str = ''
    for (const key in filter) {
      const value = filter[key]?.trim()
      if (value || (key === 'bonded' || key === 'pending')) {
        str += `&filter[${key}]=${value}`
      }
    }
    return str
  }, [filter])

  const { isLoading: loading, data, error } = useQuery([`events:${eventName}-${page}-${limit}-${filterString}`, page, limit, eventName, filterString], async () => {
    try {
      return await fetchEvents({
        eventName,
        limit,
        page,
        filterString
      })
    } catch (err: any) {
      console.error(err.message)
    }
  }, {
    enabled: true,
    refetchInterval: intervalMs
  })

  async function previousPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) - 1) || 1
    setPage(newPage)
    if (onPagination) {
      onPagination({ page: newPage, limit })
    }
  }

  async function nextPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) + 1) || 1
    setPage(newPage)
    if (onPagination) {
      onPagination({ page: newPage, limit })
    }
  }

  // Update limit when queryParams change
  useMemo(() => {
    if (queryParams?.limit && queryParams.limit !== limit) {
      setLimit(Number(queryParams.limit))
    }
  }, [queryParams?.limit])

  const showPreviousButton = page > 1
  const events = data?.events || []
  const showNextButton = data?.hasNextPage ?? false

  return {
    events,
    nextPage,
    previousPage,
    limit,
    showNextButton,
    showPreviousButton,
    loading
  }
}

