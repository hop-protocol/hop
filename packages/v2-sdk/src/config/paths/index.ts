import type { PathConfig } from './types.js'
import { paths as mainnetPaths } from './mainnet.js'
import { paths as sepoliaPaths } from './sepolia.js'

export type { PathConfig }

export const allPaths: Record<string, PathConfig> = {
  ...mainnetPaths,
  ...sepoliaPaths
}