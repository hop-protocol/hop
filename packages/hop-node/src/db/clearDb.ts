import os from 'os'
import path from 'path'
import rimraf from 'rimraf'
import { db as dbConfig } from 'src/config'

export default async function clearDb () {
  if (dbConfig.path) {
    const dbPath = path.resolve(dbConfig.path.replace('~', os.homedir()))
    rimraf.sync(dbPath)
  }
}
