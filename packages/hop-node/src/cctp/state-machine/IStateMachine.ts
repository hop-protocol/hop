export interface IStateMachine {
  // Initialization
  init (): Promise<void>
  start (): void
}
