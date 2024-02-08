import { truncateString } from './truncateString'

export function truncateHash (hash: string) {
  return truncateString(hash, 6)
}
