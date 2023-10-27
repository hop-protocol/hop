export interface IFinalityStrategy {
  getBlockNumber(): Promise<number>
  getSafeBlockNumber(): Promise<number>
  getFinalizedBlockNumber(): Promise<number>
  getSyncHeadBlockNumber(): Promise<number>
}
