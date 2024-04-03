export function isValidUrl (url: string) {
  let _url
  try {
    _url = new URL(url)
  } catch (err: any) {
    return false
  }

  return _url.protocol === 'http:' || _url.protocol === 'https:'
}
