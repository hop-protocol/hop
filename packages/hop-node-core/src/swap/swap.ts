import { SwapInput } from './types'
import { swap as uniswapSwap } from 'src/swap/uniswap'

export async function swap (dex: string, input: SwapInput) {
  if (!dex) {
    throw new Error('dex option is required')
  }
  if (dex === 'uniswap') {
    return uniswapSwap(input)
  }
  
  throw new Error(`Invalid dex: ${dex}`)
}
