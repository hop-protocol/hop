import { HopBridge } from '@hop-protocol/sdk'
import find from 'lodash/find'

export function findMatchingBridge(bridges: HopBridge[], tokenSymbol?: string) {
  return find(bridges, b => b.getTokenSymbol() === tokenSymbol)
}
