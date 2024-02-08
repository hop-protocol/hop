import { networks } from '../config'

export function explorerLink (chain: string) {
  return (networks as any)[chain]?.explorerUrls?.[0] ?? ''
}
