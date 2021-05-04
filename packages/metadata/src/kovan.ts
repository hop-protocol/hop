import deepmerge from 'deepmerge'
import { tokens } from './tokens'
import { Tokens } from './types'

export const metadata = {
  tokens: deepmerge(tokens, {
    USDC: {
      decimals: 18 // TODO: Remove once new kovan contracts are deployed
    }
  }) as Tokens
}
