import Logger from 'src/logger'
import getChainBridge from 'src/chains/getChainBridge'
import getDecodedValidationData from 'src/utils/getDecodedValidationData'
import getEncodedValidationData from 'src/utils/getEncodedValidationData'
import {
  AvgBlockTimeSeconds,
  BlockHashExpireBufferSec,
  Chain,
  NumStoredBlockHashes,
  TimeToIncludeOnL1Sec,
  TimeToIncludeOnL2Sec
} from 'src/constants'
import { BlockHashValidationError, BonderTooEarlyError } from 'src/types/error'
import { Contract, providers } from 'ethers'
import { IChainBridge } from '../chains/IChainBridge'
import { ShouldIgnoreBlockHashValidation, config as globalConfig } from 'src/config'
import { getRpcProvider } from 'src/utils/getRpcProvider'

export interface HiddenCalldataParams {
  tokenSymbol: string
  sourceChainSlug: string
  destChainSlug: string
  l2TxHash: string
  l2BlockNumber: number
  logger: Logger
}

// The blockHash validator is unconcerned with the proxy. That is handle by the caller.

// Returns packed(address,data) without the leading 0x
export async function getHiddenCalldataForDestinationChain (input: HiddenCalldataParams): Promise<string> {
  const { tokenSymbol, sourceChainSlug, destChainSlug, l2TxHash, l2BlockNumber, logger } = input

  if (!tokenSymbol || !sourceChainSlug || !destChainSlug || !l2TxHash || !l2BlockNumber || !logger) {
    throw new BlockHashValidationError(`missing input params: ${JSON.stringify(input)}`)
  }

  const sourceChainBridge: IChainBridge = getChainBridge(sourceChainSlug)
  if (typeof sourceChainBridge.getL1InclusionTx !== 'function') {
    throw new BlockHashValidationError(`sourceChainBridge getL1InclusionTx not implemented for chain ${sourceChainSlug}`)
  }

  const isHashStoredAppx = await isBlockHashStoredAtBlockNumberAppx(l2BlockNumber, sourceChainSlug, destChainSlug)
  if (!isHashStoredAppx) {
    throw new BlockHashValidationError(`block hash for block number ${l2BlockNumber} is no longer stored at dest`)
  }

  logger.debug('getHiddenCalldataForDestinationChain: retrieving l1InclusionBlock')
  let l1InclusionTx: providers.TransactionReceipt | undefined 
  try {
    l1InclusionTx = await sourceChainBridge.getL1InclusionTx(l2TxHash)
  } catch (err) {
    throw new BlockHashValidationError(`getL1InclusionTx error ${l2TxHash} on L1. err: ${err.message}`)
  }
  if (!l1InclusionTx) {
    throw new BonderTooEarlyError(`l1InclusionTx not found for l2TxHash ${l2TxHash}, l2BlockNumber ${l2BlockNumber}`)
  }

  logger.debug(`getHiddenCalldataForDestinationChain: l1InclusionTx found ${l1InclusionTx.transactionHash}`)
  let inclusionTxInfo: providers.TransactionReceipt| undefined
  if (destChainSlug === Chain.Ethereum) {
    inclusionTxInfo = l1InclusionTx
  } else {
    logger.debug(`getHiddenCalldataForDestinationChain: getting blockInfo for l1InclusionTx ${l1InclusionTx.transactionHash} on destination chain ${destChainSlug}`)
    const destChainBridge: IChainBridge = getChainBridge(destChainSlug)
    if (typeof destChainBridge.getL2InclusionTx !== 'function') {
      throw new BlockHashValidationError(`destChainBridge getL2InclusionTx not implemented for chain ${destChainSlug}`)
    }
    try {
      inclusionTxInfo = await destChainBridge.getL2InclusionTx(l1InclusionTx.transactionHash)
    } catch (err) {
      throw new BlockHashValidationError(`getL2InclusionTx error ${l1InclusionTx.transactionHash} on chain ${destChainSlug}. err: ${err.message}`)
    }
  }

  if (!inclusionTxInfo) {
    throw new BonderTooEarlyError(`inclusionTxInfo not found for l2TxHash ${l2TxHash}, l2BlockNumber ${l2BlockNumber}`)
  }
  logger.debug(`getHiddenCalldataForDestinationChain: inclusionTxInfo on destination chain ${destChainSlug}`)

  // TODO: Once inclusion watcher is implemented, move this to the top of this function so that the prior calls don't throw.
  // Return if the blockHash is no longer stored at the destination
  const isHashStored = await isBlockHashStoredAtBlockNumber(inclusionTxInfo.blockNumber, destChainSlug)
  if (!isHashStored) {
    throw new BlockHashValidationError(`block hash for block number ${inclusionTxInfo.blockNumber} is no longer stored at dest`)
  }

  const validatorAddress = getValidatorAddressForChain(tokenSymbol, destChainSlug)
  if (!validatorAddress) {
    throw new BlockHashValidationError(`validator address not found for chain ${destChainSlug}`)
  }
  const hiddenCalldata: string = getEncodedValidationData(
    validatorAddress,
    inclusionTxInfo.blockHash,
    inclusionTxInfo.blockNumber
  )

  await validateHiddenCalldata(tokenSymbol, hiddenCalldata, destChainSlug)
  return hiddenCalldata.slice(2)
}

async function isBlockHashStoredAtBlockNumber (blockNumber: number, chainSlug: string): Promise<boolean> {
  // The current block should be within (256 - buffer) blocks of the decoded blockNumber
  const provider: providers.Provider = getRpcProvider(chainSlug)!
  const currentBlockNumber = await provider.getBlockNumber()
  const numBlocksToBuffer = AvgBlockTimeSeconds[chainSlug] * BlockHashExpireBufferSec
  const earliestBlockWithBlockHash = currentBlockNumber - (NumStoredBlockHashes + numBlocksToBuffer)
  if (blockNumber < earliestBlockWithBlockHash) {
    return false
  }
  return true
}

async function validateHiddenCalldata (tokenSymbol: string, data: string, chainSlug: string) {
  // Call the contract so the transaction fails, if needed, prior to making it onchain
  const { blockHash, blockNumber } = getDecodedValidationData(data)
  const validatorAddress = getValidatorAddressForChain(tokenSymbol, chainSlug)
  if (!validatorAddress) {
    throw new BlockHashValidationError(`validator address not found for chain ${chainSlug}`)
  }

  const provider: providers.Provider = getRpcProvider(chainSlug)!
  const validatorAbi = ['function isBlockHashValid(bytes32,uint256) view returns (bool)']
  const validatorContract = new Contract(validatorAddress, validatorAbi, provider)
  const isValid = await validatorContract.isBlockHashValid(blockHash, blockNumber)

  // NOTE: There is a race condition here where the blockHash and blockNumber could be valid but isBlockHashValid
  // returns false. This would happen if the check is performed near the head of the chain and the RPC call for
  // isBlockHashValid is not yet at the head, even though the data will be correct when we get there. Since
  // it is not trivial to know if the RPC call is at the head, we do not know if the data is truly invalid or if
  // the data does not yet exist at that specific call. Because of this, we need to mark this as a BonderTooEarlyError
  // instead of a BlockHashValidationError so that this is retried.
  if (!isValid) {
    throw new BonderTooEarlyError(`blockHash ${blockHash} is not valid for blockNumber ${blockNumber} with validator ${validatorAddress}`)
  }
}

async function isBlockHashStoredAtBlockNumberAppx (blockNumber: number, sourceChainSlug: string, destChainSlug: string): Promise<boolean> {
  // Get chain-specific constants
  const hashStorageTime = AvgBlockTimeSeconds[destChainSlug] * NumStoredBlockHashes
  const fullInclusionTime = TimeToIncludeOnL1Sec[sourceChainSlug] + TimeToIncludeOnL2Sec[destChainSlug]

  // Get the expected bond time
  const sourceProvider: providers.Provider = getRpcProvider(sourceChainSlug)!
  const sourceTxTimestamp = (await sourceProvider.getBlock(blockNumber)).timestamp
  const expectedBondTime = sourceTxTimestamp + fullInclusionTime

  // Compare values
  const currentTimestamp = (await sourceProvider.getBlock('latest')).timestamp
  if (currentTimestamp > expectedBondTime + hashStorageTime) {
    return false
  }
  return true
}

function getValidatorAddressForChain (token: string, chainSlug: string): string | undefined {
  return globalConfig.addresses?.[token]?.[chainSlug]?.validator
}

export function isBlockHashValidationEnabledForRoute (sourceChainSlug: string, destinationChainSlug: string): boolean {
  if (ShouldIgnoreBlockHashValidation) {
    return false
  }

  // Both a source and dest chain must implement proxy validation
  // If the dest is L1, then only the source needs to implement proxy validation

  const sourceChainBridge: IChainBridge = getChainBridge(sourceChainSlug)
  if (typeof sourceChainBridge.getL1InclusionTx !== 'function') {
    return false
  }

  if (destinationChainSlug === Chain.Ethereum) {
    return true
  }

  const destinationChainBridge: IChainBridge = getChainBridge(destinationChainSlug)
  if (typeof destinationChainBridge.getL2InclusionTx !== 'function') {
    return false
  }

  return true
}
