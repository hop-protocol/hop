import { useState, useEffect } from 'react'
import { apiUrl } from '@/app/config'

export const useFetchPaths = (props: any = {}) => {
  const { onPagination } = props
  const [hasNextPage, setHasNextPage] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const url = `${apiUrl}/v1/paths?page=${page}&limit=${limit}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
        setPaths(data.paths)
        setHasNextPage(data.hasNextPage)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPaths()
  }, [page, limit])

  const showPreviousButton = page > 1
  const showNextButton = hasNextPage ?? false

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

  return { paths, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit }
}
