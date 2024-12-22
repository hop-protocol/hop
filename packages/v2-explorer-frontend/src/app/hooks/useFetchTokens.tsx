import { useState, useEffect, useMemo } from 'react'
import { apiUrl } from '@/app/config'

export const useFetchTokens = (filter: any) => {
  const [hasNextPage, setHasNextPage] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterString = useMemo(() => {
    let str = ''
    for (const key in filter) {
      const value = filter[key]?.trim()
      if (value) {
        str += `&filter[${key}]=${value}`
      }
    }
    return str
  }, [filter])

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const url = `${apiUrl}/v1/tokens?page=${page}&limit=${limit}${filterString}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setTokens(data.tokens)
        setHasNextPage(data.hasNextPage)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [page, limit, filterString])

  const showPreviousButton = page > 1
  const showNextButton = hasNextPage ?? false

  async function previousPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) - 1) || 1
    setPage(newPage)
  }

  async function nextPage (event: any) {
    event.preventDefault()
    const newPage = (Number(page) + 1) || 1
    setPage(newPage)
  }

  return { tokens, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit }
}
