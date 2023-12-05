import BaseDb from './BaseDb'
import { MarshalledTx } from 'src/gasboost/GasBoostTransaction'

class GasBoostDb extends BaseDb<MarshalledTx> {
  async update (key: string, data: MarshalledTx): Promise<void> {
    await this.put(key, data)
  }

  // Use the name getItem instead of getValueByKey to retain store interface
  async getItem (key: string): Promise<MarshalledTx | null> {
    const item = await this.get(key)
    if (!item) {
      return null
    }
    return item
  }

  async deleteItem (key: string): Promise<void> {
    await this.del(key)
  }
}

export default GasBoostDb
