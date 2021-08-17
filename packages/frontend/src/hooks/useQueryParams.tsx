import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'

const useQueryParams = () => {
  const history = useHistory()
  const location = useLocation()
  const queryParams = useMemo(() => {
    return qs.parse(location.search, { ignoreQueryPrefix: true })
  }, [location])

  const updateQueryParams = (updates: {[index: string]: string}) => {
    Object.assign(queryParams, updates)

    history.push({
      search: qs.stringify(queryParams)
    })
  }

  return { queryParams, updateQueryParams }
}

export default useQueryParams
