export interface IRelayerDB<RelayItem> {
  addItem (item: RelayItem): Promise<void>
  removeItem (item: RelayItem): Promise<void>
  updateRelayTime (item: RelayItem): Promise<void>
}
