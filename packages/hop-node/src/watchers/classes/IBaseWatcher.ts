export interface IBaseWatcher {
  pollCheck(): Promise<void>
  prePollHandler(): boolean
  pollHandler(): Promise<void>
  postPollHandler(): Promise<void>

  start(): Promise<void>
  stop(): Promise<void>
}
