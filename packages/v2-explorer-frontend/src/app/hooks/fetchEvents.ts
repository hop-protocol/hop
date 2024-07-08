import { apiUrl } from '../config'

export async function fetchEvents (options: any = {}) {
  let { eventName, limit, page, filterString, filter } = options
  let pathname = '/events'
  if (eventName === 'explorer')  {
    pathname = '/explorer'
  }

  if (filter && !filterString) {
    let str = ''
    for (const key in filter) {
      const value = filter[key]
      if (value || (key === 'bonded' || key === 'pending')) {
        str += `&filter[${key}]=${value}`
      }
    }
    filterString = str
  }

  const url = `${apiUrl}/v1${pathname}?limit=${limit || 10}&page=${page || 1}&eventName=${eventName}${filterString || ''}`
  const res = await fetch(url)
  const json = await res.json()
  if (json.error) {
    throw new Error(json.error)
  }
  if (!json.events) {
    throw new Error('no events')
  }
  return json
}
