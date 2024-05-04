import { swap as uniswapSwap } from './uniswap/index.js'
import type { SwapInput } from './types.js'

export async function swap (dex: string, input: SwapInput) {
  if (!dex) {
    throw new Error('dex option is required')
  }
  if (dex === 'uniswap') {
    return uniswapSwap(input)
  }
  
  throw new Error(`Invalid dex: ${dex}`)
}
