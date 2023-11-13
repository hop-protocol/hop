import { metadata as goerli } from './goerli'
import { metadata as mainnet } from './mainnet'

const metadata = { goerli, mainnet }
export { goerli, mainnet, metadata }

export * from './types'
export { tokens } from './tokens'
export { chains } from './chains'
