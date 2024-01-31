export function getQueryParam (param: string): string | null {
  try {
    const parts = window.location.href.split('?')
    const qs = `?${parts[1] || ''}`
    const params = new URLSearchParams(qs)
    const value = params.get(param)
    if (!value) {
      return null
    }
    return value
  } catch (err: any) {
    return null
  }
}
