export interface IBaseWatcher {
  pollSync(): Promise<void>
  preSyncHandler(): Promise<void>
  syncHandler(): Promise<void>
  postSyncHandler(): Promise<void>

  pollCheck(): Promise<void>
  prePollHandler(): Promise<void>
  pollHandler(): Promise<void>
  postPollHandler(): Promise<void>

  start(): Promise<void>
  stop(): Promise<void>
}
