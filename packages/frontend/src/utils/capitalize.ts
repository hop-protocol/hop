export function capitalize (word: string) {
  if (!word || word?.length < 2) {
    return word
  }
  return word.charAt(0).toUpperCase() + word.slice(1)
}
