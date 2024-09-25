import { ConfigManager } from '../ConfigManager.js'
import type { ClientName } from '#clients/index.js'

export interface ICLIConfig {
  customConfigPath: string
  dryRun: boolean
  clientName: ClientName
}

export class CLIConfig extends ConfigManager {
  static dryRun: boolean

  protected static override async init(sharedConfig: ICLIConfig): Promise<void> {
    const { dryRun } = sharedConfig
    this.dryRun = dryRun
  }

  protected static override async validate(): Promise<void> {
    return
  }
}
