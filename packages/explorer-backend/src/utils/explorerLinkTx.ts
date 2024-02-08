import { explorerLink } from './explorerLink'

export function explorerLinkTx (chain: string, transactionHash: string) {
  const base = explorerLink(chain)
  return `${base}/tx/${transactionHash || ''}`
}
