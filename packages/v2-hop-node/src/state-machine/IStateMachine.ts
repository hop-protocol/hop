export interface IStateMachine<StateData> {
  // Initialization
  init (): Promise<void>
  start (): void

  // Items that are not yet at their final state
  getItemsInProgress (): AsyncIterable<StateData>
}
