export type SwapInput = {
  chain: string
  fromToken: string
  toToken: string
  amount: number
  max?: boolean
  slippage: number
  recipient: string
  dryMode: boolean
  deadline?: number
}
