import { isValidUrl } from './isValidUrl.js'
import { promiseTimeout } from './promiseTimeout.js'

export async function fetchJsonOrThrow (url: string, timeoutMs: number = 5 * 1000) {
  try {
    if (!isValidUrl(url)) {
      throw new Error(`url "${url}" is invalid`)
    }
    let signal : any
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), timeoutMs)
      signal = controller.signal
    }

    const res = await (signal ? fetch(url, { signal }) : promiseTimeout(fetch(url), timeoutMs))
    const json = await res.json()
    if (!json || !(typeof json === 'object')) {
      throw new Error('expected json object for response')
    }
    return json
  } catch (err: any) {
    if (/timedout/gi.test(err?.message)) {
      throw new Error(`fetchJsonOrThrow: Request to "${url}" timedout after ${timeoutMs}ms. Error: ${err.message}`)
    }

    throw new Error(`fetchJsonOrThrow error: ${err.message} errObj: ${JSON.stringify(err)}`)
  }
}
