import { explorerLink } from '../utils/explorerLink'

export function explorerLinkAddress (chain: string, address: string) {
  const base = explorerLink(chain)
  return `${base}/address/${address || ''}`
}
