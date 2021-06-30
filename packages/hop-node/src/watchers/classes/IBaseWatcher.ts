export interface IBaseWatcher {
  syncUp(): Promise<void>
  watch(): Promise<void>
  pollCheck(): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
