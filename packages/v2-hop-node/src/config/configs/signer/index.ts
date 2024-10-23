import { type ISignerConfig, SignerConfig } from './SignerConfig.js'

export async function initConfigs (config: ISignerConfig): Promise<void> {
  await SignerConfig.initializeConfig(config)
}

export { SignerConfig }
