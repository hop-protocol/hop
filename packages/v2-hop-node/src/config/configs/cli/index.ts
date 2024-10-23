import { type ICLIConfig, CLIConfig } from './CLIConfig.js'

export async function initConfigs (config: ICLIConfig): Promise<void> {
  await CLIConfig.initializeConfig(config)
}

export {
  type ICLIConfig,
  CLIConfig
}
