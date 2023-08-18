import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { stringify, parse } from 'qs'

const useQueryParams = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = useMemo(
    () => parse(location.search, { parseArrays: false, ignoreQueryPrefix: true }),
    [location.search]
  )

  const updateQueryParams = (updates: { [index: string]: string | undefined }) => {
    Object.assign(queryParams, updates)

    navigate('?' + stringify(queryParams))
  }

  return { queryParams, updateQueryParams, location }
}

export default useQueryParams
