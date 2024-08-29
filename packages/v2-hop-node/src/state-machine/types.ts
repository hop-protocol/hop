interface TxContext {
  txHash: string
  timestampMs: number
  chainId: string
}

export interface StateTxContext {
  txContext: TxContext
}
