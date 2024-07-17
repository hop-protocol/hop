import { parse, stringify } from 'qs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

const useQueryParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const queryParams = useMemo(() => {
    const queryString = searchParams.toString()
    return parse(queryString, { parseArrays: false, ignoreQueryPrefix: true })
  }, [searchParams])

  const updateQueryParams = (updates: { [index: string]: string | undefined }) => {
    const newQueryParams = { ...queryParams, ...updates }
    Object.keys(newQueryParams).forEach(key => {
      if (newQueryParams[key] === undefined) {
        delete newQueryParams[key]
      }
    })

    const searchString = stringify(newQueryParams)
    router.push(`${pathname}?${searchString}`)
  }

  return { queryParams, updateQueryParams }
}

export { useQueryParams }
