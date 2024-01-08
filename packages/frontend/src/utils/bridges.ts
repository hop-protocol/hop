import find from 'lodash/find'
import { HopBridge } from '@hop-protocol/sdk'

export function findMatchingBridge(bridges: HopBridge[], tokenSymbol?: string) {
  return find(bridges, b => b.getTokenSymbol() === tokenSymbol)
}
