import { DB } from './DB.js'

/**
 * The key is the txHash and the value is a boolean indicating if the txHash exists.
 */

type DBKey = string
type DBValue = boolean

export class TxRelayDB extends DB<DBKey, DBValue> {

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
