export default interface Store {
  updateItem: (key: string, value: any) => Promise<void>
  getItem: (key: string) => Promise<any>
  deleteItem: (key: string) => Promise<void>
}
