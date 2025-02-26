import { apiUrl } from '@/app/config'
// import { type Request } from 'next/server'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 1, checkperiod: 1 }) // in seconds

export async function GET(request: any) {
  const u = new URL(request.url)
  const url = `${apiUrl}/v1${u.searchParams.get('pathname')}${u.search}`
  console.log('route GET', url)
  const key = url
  let data = cache.get(key)
  if (data) {
    console.log('cache hit', key)
    return Response.json(data)
  }
  const isAllEvents = u.searchParams.get('pathname') === '/events'
  const isExplorerEvents = u.searchParams.get('pathname') === '/explorer'
  const cacheTimeSeconds = isAllEvents ? 60 : isExplorerEvents ? 10 : 5

  console.log('cache miss' , key)
  console.log('fetching', url)
  const res = await fetch(url)
  data = await res.json()

  if (res.ok) {
    cache.set(key, data, cacheTimeSeconds)
  }

  return Response.json(data)
}
