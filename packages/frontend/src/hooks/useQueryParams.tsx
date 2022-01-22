import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { stringify, parse } from 'qs'

const useQueryParams = () => {
  const history = useHistory()
  const location = useLocation()

  const queryParams = useMemo(
    () => parse(location.search, { parseArrays: false, ignoreQueryPrefix: true }),
    [location.search]
  )

  const updateQueryParams = (updates: { [index: string]: string }) => {
    Object.assign(queryParams, updates)

    history.push({
      search: stringify(queryParams),
    })
  }

  return { queryParams, updateQueryParams, location }
}

export default useQueryParams
