import { networks } from '../config'

export function explorerLink (chain: string) {
  return networks[chain]?.explorerUrls?.[0] ?? ''
}
