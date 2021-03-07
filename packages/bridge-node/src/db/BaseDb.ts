import { promisify } from 'util'
import levelup from 'levelup'
import leveldown from 'leveldown'
import sub from 'level-sublevel'
import TransfersDb from './TransfersDb'

export const db = sub(levelup(leveldown('src/db/db_data')), {
  valueEncoding: 'json'
})

class BaseDb {
  protected db: any

  constructor (prefix: string) {
    this.db = db.sublevel(prefix)
  }

  handleDataEvent = (err, data) => {
    // abstract
  }

  async update (id: string, data: any, dataCb: boolean = true) {
    const entry = await this.getById(id, {})
    await promisify(this.db.put)(id, { ...entry, ...data })

    return new Promise((resolve, reject) => {
      if (!dataCb) {
        resolve(null)
        return
      }
      this.db.createReadStream().on('data', async (data, err, f) => {
        try {
          await this.handleDataEvent(err, data)
        } catch (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  async getById (id: string, defaultValue: any = null) {
    try {
      return await promisify(this.db.get)(id)
    } catch (err) {
      return defaultValue
    }
  }
}

export default BaseDb
