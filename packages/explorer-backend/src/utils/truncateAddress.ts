import { truncateString } from './truncateString'

export function truncateAddress (address :string) {
  return truncateString(address, 4)
}
