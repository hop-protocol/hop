import { parse, stringify } from 'qs'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

const useQueryParams = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = useMemo(
    () => parse(location.search, { parseArrays: false, ignoreQueryPrefix: true }),
    [location.search]
  )

  const updateQueryParams = (updates: { [index: string]: string | undefined }) => {
    Object.assign(queryParams, updates)

    navigate(`${location.pathname}?${stringify(queryParams)}`)
  }

  return { queryParams, updateQueryParams, location }
}

export default useQueryParams
