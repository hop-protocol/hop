import fs from 'node:fs'
import { ConfigManager } from '../ConfigManager.js'
import { mkdirp } from 'mkdirp'

export interface ISharedConfig {
  dbDir: string
}

export class SharedConfig extends ConfigManager {
  static dbDir: string

  protected static override async init(sharedConfig: ISharedConfig): Promise<void> {
    const { dbDir } = sharedConfig
    this.dbDir = dbDir

    // Create DB dir if it doesn't exist
    mkdirp.sync(this.dbDir)
  }

  protected static override async validate(): Promise<void> {
    if (!this.dbDir || !fs.existsSync(this.dbDir)) {
      throw new Error(`Invalid or missing dbDir: ${this.dbDir}`)
    }
  }
}
