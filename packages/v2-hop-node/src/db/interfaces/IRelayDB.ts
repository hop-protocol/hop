export interface IRelayDB<RelayItem> {
  addItem (item: RelayItem): Promise<void>
  removeItem (item: RelayItem): Promise<void>
  updateRelayTime (item: RelayItem): Promise<void>
}
