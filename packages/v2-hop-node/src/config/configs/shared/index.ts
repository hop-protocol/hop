import { type ISharedConfig, SharedConfig } from './SharedConfig.js'

export async function initConfigs (config: ISharedConfig): Promise<void> {
  await SharedConfig.initializeConfig(config)
}

export { SharedConfig }
