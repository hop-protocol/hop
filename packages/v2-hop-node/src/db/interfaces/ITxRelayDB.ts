export interface ITxRelayDB {
  addItem (item: string): Promise<void>
  removeItem (item: string): Promise<void>
  doesItemExist (item: string): Promise<boolean>
}
