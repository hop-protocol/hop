export interface IStateMachine<StateData> {
  // Initialization
  init (): Promise<void>
  start (): void

  // Items that are not yet at their final state
  getItemsInProgress (): AsyncIterable<StateData>
  // Retrieves a specific attribute of an item in any state
  getItemAttribute<
    ArbitraryState extends StateData,
    Attribute extends keyof ArbitraryState
  >(
    value: StateData,
    attribute: Attribute
  ): Promise<ArbitraryState[Attribute]>
}
