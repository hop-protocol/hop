export function getQueryParam (param: string): string | null {
  try {
    const parts = window.location.href.split('?')
    const qs = `?${parts[1] || ''}`
    const params = new URLSearchParams(qs)
    return params.get(param)
  } catch (err: any) {
    return null
  }
}
