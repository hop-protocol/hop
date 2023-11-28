import BaseDb from './BaseDb'
import { MarshalledTx } from 'src/gasboost/GasBoostTransaction'

class GasBoostDb extends BaseDb<MarshalledTx> {
  async update (key: string, data: MarshalledTx): Promise<void> {
    await this._put(key, data)
  }

  async getItem (key: string): Promise<MarshalledTx | null> {
    const item = await this._get(key)
    if (!item) {
      return null
    }
    return item
  }

  async deleteItem (key: string): Promise<void> {
    await this._del(key)
  }
}

export default GasBoostDb
