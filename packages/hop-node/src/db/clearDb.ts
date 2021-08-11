import os from 'os'
import path from 'path'
import rimraf from 'rimraf'
import { config as globalConfig } from 'src/config'

export default async function clearDb () {
  if (globalConfig.db.path) {
    const dbPath = path.resolve(globalConfig.db.path.replace('~', os.homedir()))
    rimraf.sync(dbPath)
  }
}
