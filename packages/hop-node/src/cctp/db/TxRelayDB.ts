import { DB } from './DB.js'

export class TxRelayDB extends DB<string, boolean> {

  // Tx Hashes are unique across all chains and address so
  // no per-DB identifier is needed.
  constructor () {
    super('TxRelayDB')
  }

  async addTxHash (txHash: string): Promise<void> {
    return this.put(txHash, true)
  }

  async doesTxHashExist (txHash: string): Promise<boolean> {
    return this.has(txHash)
  }
}
