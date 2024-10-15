import type { ClientName } from '#clients/index.js'
import { ConfigManager } from '../ConfigManager.js'

export interface ICLIConfig {
  customConfigPath: string
  dryRun: boolean
  clientName: ClientName
}

export class CLIConfig extends ConfigManager {
  static dryRun: boolean
  static clientName: ClientName

  protected static override async init(sharedConfig: ICLIConfig): Promise<void> {
    const { dryRun } = sharedConfig
    this.dryRun = dryRun
    this.clientName = sharedConfig.clientName
  }

  protected static override async validate(): Promise<void> {
    return
  }
}
