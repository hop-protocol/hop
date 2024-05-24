import type { providers } from 'ethers'

export type LogWithChainId = providers.Log & { chainId: string }
