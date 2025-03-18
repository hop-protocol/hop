import { apiUrl, appApiHost } from '@/app/config'

export async function fetchEvents (options: any = {}) {
  try {
    let { eventName, limit, page, filterString, filter } = options
    let pathname = '/events'
    if (eventName === 'explorer')  {
      pathname = '/explorer'
    }

    if (filter && !filterString) {
      let str = ''
      for (const key in filter) {
        const value = filter[key]?.trim()
        if (value || (key === 'bonded' || key === 'pending')) {
          str += `&filter[${key}]=${value}`
        }
      }
      filterString = str
    }

    // const url = `${apiUrl}/v1${pathname}?limit=${limit || 10}&page=${page || 1}&eventName=${eventName}${filterString || ''}`

    const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
    const protocol = hostname.includes('localhost') ? 'http' : 'https'

    const url = `${protocol}://${hostname}/api/?pathname=${pathname}&limit=${limit || 10}&page=${page || 1}&eventName=${eventName}${filterString || ''}`
    console.log('fetchEvents url', url)
    const res = await fetch(url)
    const json = await res.json()
    // console.log('fetchEvents json', json.events[0])
    if (json.error) {
      throw new Error(json.error)
    }
    if (!json.events) {
      throw new Error('no events')
    }
    return json
  } catch (error) {
    console.error(error)
    return null
  }
}
