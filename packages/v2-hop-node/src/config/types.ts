import type{ ISharedConfig } from './configs/shared/SharedConfig.js'
import type { ISignerConfig } from './configs/signer/SignerConfig.js'
import type { ICLIConfig } from './configs/cli/CLIConfig.js'
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
