export default interface Store {
  update: (key: string, value: any) => Promise<void>
  getItem: (key: string) => Promise<any>
  deleteItem: (key: string) => Promise<void>
}
