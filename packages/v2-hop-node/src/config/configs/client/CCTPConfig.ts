import { ConfigManager } from '../../ConfigManager.js'

export interface ICCTPConfig {}

export class CCTPConfig extends ConfigManager {
  protected static override async init(config: ICCTPConfig): Promise<void> {}
  protected static override async validate(): Promise<void> {}
}
