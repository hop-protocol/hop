import { SwapInput } from './types'
import { swap as oneInchSwap } from 'src/swap/1inch'
import { swap as uniswapSwap } from 'src/swap/uniswap'

export async function swap (dex: string, input: SwapInput) {
  if (!dex) {
    throw new Error('dex option is required')
  }
  if (dex === 'uniswap') {
    return uniswapSwap(input)
  } else if (dex === '1inch') {
    return oneInchSwap(input)
  }

  throw new Error(`Invalid dex: ${dex}`)
}
