export interface IBaseWatcher {
  pollCheck(): Promise<void>
  prePollHandler(): Promise<void>
  pollHandler(): Promise<void>
  postPollHandler(): Promise<void>

  start(): Promise<void>
  stop(): Promise<void>
}
