import type{ ISharedConfig } from './configs/SharedConfig.js'
import type { ISignerConfig } from './configs/SignerConfig.js'
import type { ICLIConfig } from './configs/CLIConfig.js'
import type { IRailsConfig } from './configs/client/RailsConfig.js'
import type { ICCTPConfig } from './configs/client/CCTPConfig.js'

export interface IConfig {
  shared: ISharedConfig
  signer: ISignerConfig
  client: {
    rails: IRailsConfig
    cctp: ICCTPConfig
  }
  cli: ICLIConfig
}
