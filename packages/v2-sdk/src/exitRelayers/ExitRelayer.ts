export interface ExitRelayer {
  getExitPopulatedTx (l2TxHash: string): Promise<any>
  exitTx(l2TxHash: string): Promise<any>
  getIsL2TxHashExited(l2TxHash: string): Promise<any>
}
