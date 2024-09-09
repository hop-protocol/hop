export type NextState<State> = Exclude<State, State>

interface TxContext {
  txHash: string
  timestampMs: number
  chainId: string
}

export interface StateTxContext {
  txContext: TxContext
}
