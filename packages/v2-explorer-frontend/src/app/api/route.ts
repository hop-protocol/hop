import { apiUrl } from '@/app/config'
// import { type Request } from 'next/server'
import NodeCache from 'node-cache'

export const dynamic = 'force-dynamic'

const cache = new NodeCache({ stdTTL: 60, checkperiod: 30 }) // in seconds

export async function GET(request: any) {
  const u = new URL(request.url)
  const url = `${apiUrl}/v1${u.searchParams.get('pathname')}${u.search}`
  const key = url
  let data = cache.get(key)
  if (data) {
    console.log('cache hit', key)
    return Response.json(data)
  }

  console.log('cache miss' , key)
  const res = await fetch(url)
  data = await res.json()

  if (res.ok) {
    // TODO: update cache time depending on response type
    cache.set(key, data, 5) // seconds
  }

  return Response.json(data)
}
