import Logger from 'src/logger'
import { Signer, providers } from 'ethers'

export interface InclusionServiceConfig {
  chainSlug: string
  l1Wallet: Signer
  l2Wallet: Signer
  logger: Logger
}

export interface IInclusionService {
  getL1InclusionTx(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
}