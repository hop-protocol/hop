export function updateQueryParams (params: any) {
  try {
    const parts = window.location.href.split('?')
    const qs = `?${parts[1] || ''}`
    if ('URLSearchParams' in window) {
      const searchParams = new URLSearchParams(qs)
      for (const key in params) {
        const value = params[key]
        if (value) {
          searchParams.set(key, value)
        } else {
          searchParams.delete(key)
        }
      }

      const url = new URL(`${parts[0]}?${searchParams.toString()}`)
      const newUrl = url.toString()

      window.history.replaceState({}, document.title, newUrl)
    }
  } catch (err) {
    console.log(err)
  }
}
