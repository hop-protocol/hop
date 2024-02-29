import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useInterval } from 'react-use'
import { apiUrl } from '../config'
import { useQuery } from 'react-query'

export function useEvents (eventName: string, filter: any = {}, onPagination?: any, queryParams?: any) {
  const [hasNextPage, setHasNextPage] = useState(false)
  const [page, setPage] = useState(queryParams?.page || 1)
  const limit = 10

  const filterString = useMemo(() => {
    let str = ''
    for (const key in filter) {
      const value = filter[key]
      if (value) {
        str += `&filter[${key}]=${value}`
      }
    }
    return str
  }, [filter])

  const { isLoading: loading, data, error } = useQuery([`events:${eventName}-${page}-${filterString}`, page, eventName, filterString], async () => {
    try {
      let pathname = '/events'
      if (eventName === 'explorer')  {
        pathname = '/explorer'
      }
      const url = `${apiUrl}/v1${pathname}?limit=${limit}&page=${page || 1}&eventName=${eventName}${filterString}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.error) {
        throw new Error(json.error)
      }
      if (!json.events) {
        throw new Error('no events')
      }
      return json
    } catch (err: any) {
      console.error(err.message)
    }
  }, {
    enabled: true,
    refetchInterval: 10 * 1000
  })

  async function previousPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) - 1) || 1
    setPage(newPage)
    if (onPagination) {
      onPagination({ page: newPage })
    }
  }

  async function nextPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) + 1) || 1
    setPage(newPage)
    if (onPagination) {
      onPagination({ page: newPage })
    }
  }

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
