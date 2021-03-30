import '../moduleAlias'
import { getL2MessengerId } from 'src/utils'

// 0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de
export const ARBITRUM_MESSENGER_ID = getL2MessengerId('arbitrum')

export const l1NetworkId = '42'
export const l1RpcUrl = 'https://kovan.rpc.hop.exchange'
export const arbitrumNetworkId = '79377087078960'
export const arbitrumRpcUrl = 'https://kovan3.arbitrum.io/rpc'
export const optimismNetworkId = '69'
export const optimismRpcUrl = 'https://kovan.optimism.io'
export const xDaiNetworkId = '77'
export const xDaiRpcUrl = 'https://sokol.poa.network'

export const MAINNET = 'mainnet'
export const KOVAN = 'kovan'
export const OPTIMISM = 'optimism'
export const ARBITRUM = 'arbitrum'
export const XDAI = 'xdai'
export const DAI = 'DAI'

// TODO: change this to mainnet on mainnet production
export const L1_NETWORK = KOVAN
