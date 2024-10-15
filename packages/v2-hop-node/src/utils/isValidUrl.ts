export const isValidUrl = (url: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
