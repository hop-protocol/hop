export interface IDataAdapter<State, StateData> {
  // Initialization
  init (): Promise<void>
  start (): void

  // Node events
  on (event: string, listener: (...args: any[]) => void): void

  // Public methods
  fetchItem (state: State, outputData: StateData): Promise<StateData | null>
}
