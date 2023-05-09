import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getTransferRootSet from 'src/theGraph/getTransferRootSet'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber, Contract, utils as ethersUtils, providers } from 'ethers'
import {
  Chain,
  ChainBalanceArchiveData,
  Token
} from 'src/constants'
import { actionHandler, parseBool, parseString, root } from './shared'
import { getSubgraphLastBlockSynced } from 'src/theGraph/getSubgraphLastBlockSynced'
import { config as globalConfig } from 'src/config'

import { getRecentUnrelayedL1ToL2Transfers } from './shared/utils'

import { main as getBondedUnconfirmedRoots } from './bondedUnconfirmedRoots'
import { main as getUnwithdrawnTransfers } from './unwithdrawnTransfers'

interface MetaBlockData {
  blockTag: providers.BlockTag
  blockTimestamp: number
}

type TokenAdjustmentData = {
  l1TokensInContract: BigNumber
  l1Stake: BigNumber
  l1TokensSentDirectlyToBridge: BigNumber
  l1TransfersUnwithdrawn: BigNumber
  l1RootsInvalid: BigNumber
}

type ChainBalanceAdjustmentData = {
  chain: Chain
  chainBalance: BigNumber
  rootsBondedNotConfirmed: BigNumber
}

type HTokenAdjustmentData = {
  chain: Chain
  hTokenTotalSupply: BigNumber
  l2Stake: BigNumber
  l2TransfersUnwithdrawn: BigNumber
  l2TransfersPendingOutbound: BigNumber
  l2TransfersInFlightFromL1ToL2: BigNumber
  l2RootsInFlightOutbound: BigNumber
  l2RootsInFlightInbound: BigNumber
}

const inactiveBonders = [
  '0x2A6303e6b99d451Df3566068EBb110708335658f',
  '0x305933e09871D4043b5036e09af794FACB3f6170',
  '0x9137a628546e2b1bc26F60A5D1262fb6D58eA44A',
  '0x15ec4512516d980090050fe101de21832c8edfee',
  '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
  '0xad103c0928acfde91dfd4e9e21225bcf9c7cbe62',
  '0x924AC9910C09A0215b06458653b30471A152022F'
]

/**
 * Verify the chainBalance against all relevant data sources. It compares (1) the tokens in the L1 contract against the
 * chainBalance, and (2) the chainBalance against the hToken total supply. If the system is unhealthy, then these
 * values would not match.
 * 
 * In order to regenerate archive data, run the generate-chain-balance-archive-data CLI command. When running it,
 * ensure that the timestamp you use is
 *
 * Definitions:
 * Adjusted Token - The amount of token after everything that can be directly withdrawn on L1 is withdrawn
 * Adjusted ChainBalance - The maximum number of hTokens that can still leave the L2.
 * Adjusted hToken - The number of hTokens plus balances that could be converted to hTokens.
 *
 * An important note for the above definitions, roots that have been committed but not yet seen on L1 are counted as
 * an increased hToken balance on the source chain (the chain the root was committed on).
 *
 * Known issues:
 *   - The (chainBalance - hToken) sometimes reports a tiny, consistent, negative number. The number is on the
 *     order of -10^-14 for 18 decimal tokens. It is consistent, but unclear why it exists. This can be considered
 *     a rounding error and is ignored in the return data, if desired.
 * 
 * Possible reasons for discrepancies:
 *   - Uncategorized
 *     - An archive transfer from L1 to L2 that was never relayed has recently been relayed
 *     - Tokens have been sent directly to the L1 bridge contract
 *     - Other archive data
 *   - Negative (token - ChainBalance)
 *     - Someone withdraw tokens that existed in the UnwithdrawnTransfers archive data
 */

root
  .command('verify-chain-balance')
  .description('Verify chain balance')
  .option('--token <symbol>', 'Token', parseString)
  .option('--log-output [boolean]', 'Log values', parseBool)
  .option('--allow-rounding-error [boolean]', 'Ignore outputs under the rounding error', parseBool)
  .action(actionHandler(main))

export async function main (source: any) {
  const { token, logOutput, allowRoundingError } = source

  if (!token) {
    throw new Error('token is required')
  }

  // Get constants
  const l2ChainsForToken: Chain[] = []
  for (const chain in globalConfig.addresses[token]) {
    if (chain === Chain.Ethereum) continue
    l2ChainsForToken.push(chain as Chain)
  }

  const metaBlockData: Record<string, MetaBlockData> = {}
  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l1Block = await l1Provider.getBlock('latest')
  metaBlockData[Chain.Ethereum] = {
    blockTag: l1Block.number,
    blockTimestamp: l1Block.timestamp
  }
  const l2Providers: Record<string, providers.Provider> = {}
  for (const l2ChainForToken of l2ChainsForToken) {
    const l2Provider = getRpcProvider(l2ChainForToken)!
    l2Providers[l2ChainForToken] = l2Provider
    const l2Block = await l2Provider.getBlock('latest')
    metaBlockData[l2ChainForToken] = {
      blockTag: l2Block.number,
      blockTimestamp: l2Block.timestamp
    }
  }

  // Subgraphs may be out of sync. If they are too far out of sync, we need to wait until they
  // are back in sync, as they are a sole source of truth for some pieces of data
  const isSubgraphSynced = await getIsSubgraphSynced(metaBlockData, l1Provider, l2Providers)
  if (!isSubgraphSynced) {
    return {
      tokenChainBalanceDiff: BigNumber.from(0),
      chainBalanceHTokenDiff: BigNumber.from(0)
    }
  }

  const {
    tokenAdjustments,
    chainBalanceAdjustments,
    hTokenAdjustments
  } = await getAdjustments(
    token,
    l2ChainsForToken,
    metaBlockData
  )

  const adjustedToken: BigNumber = getAdjustedToken(tokenAdjustments)
  const adjustedChainBalances: Record<string, BigNumber> = {}
  const adjustedHTokens: Record<string, BigNumber> = {}
  let totalAdjustedChainBalance = BigNumber.from(0)
  let totalAdjustedHToken = BigNumber.from(0)
  for (let i = 0; i < hTokenAdjustments.length; i++) {
    const chain: string = hTokenAdjustments[i].chain
    adjustedChainBalances[chain] = getAdjustedChainBalance(chainBalanceAdjustments[i])
    adjustedHTokens[chain] = getAdjustedHToken(hTokenAdjustments[i])

    totalAdjustedChainBalance = totalAdjustedChainBalance.add(adjustedChainBalances[chain])
    totalAdjustedHToken = totalAdjustedHToken.add(adjustedHTokens[chain])
  }

  const tokenChainBalanceDiff = adjustedToken.sub(totalAdjustedChainBalance)
  let chainBalanceHTokenDiff = totalAdjustedChainBalance.sub(totalAdjustedHToken)


  if (allowRoundingError) {
    const decimals: number = getTokenDecimals(token)
    const roundingError = ethersUtils.parseUnits('0.0001', decimals).mul(-1)
    if (chainBalanceHTokenDiff.isNegative() && chainBalanceHTokenDiff.gte(roundingError)) {
      chainBalanceHTokenDiff = BigNumber.from(0)
    }
  }

  // Log data if explicitly requested or if there is a discrepancy
  const isOutputExpected = tokenChainBalanceDiff.eq(0) && chainBalanceHTokenDiff.eq(0)
  if (!isOutputExpected || logOutput) {
    if (!isOutputExpected) {
      console.log(`Unexpected output for token ${token}`)
    }
    logValues(token, tokenAdjustments, chainBalanceAdjustments, hTokenAdjustments, metaBlockData)
  }
  return {
    tokenChainBalanceDiff,
    chainBalanceHTokenDiff
  }
}

async function getAdjustments (token: Token, l2ChainsForToken: Chain[], metaBlockData: Record<string, MetaBlockData>) {
  const {
    l1Bridge,
    l1CanonicalToken
  } = contracts.get(token, Chain.Ethereum)

  const tokenAdjustments = await getTokenAdjustments(
    token,
    l1Bridge,
    l1CanonicalToken,
    metaBlockData
  )

  const chainBalanceAdjustmentPromises: Array<Promise<ChainBalanceAdjustmentData>> = []
  const hTokenAdjustmentPromises: Array<Promise<HTokenAdjustmentData>> = []
  for (const chain of l2ChainsForToken) {
    chainBalanceAdjustmentPromises.push(getChainBalanceAdjustments(
      token,
      chain,
      l1Bridge,
      metaBlockData
    ))
    hTokenAdjustmentPromises.push(getHTokenAdjustments(
      token,
      chain,
      l2ChainsForToken,
      metaBlockData
    ))
  }
  const chainBalanceAdjustments: ChainBalanceAdjustmentData[] = await Promise.all([...chainBalanceAdjustmentPromises])
  const hTokenAdjustments: HTokenAdjustmentData[] = await Promise.all([...hTokenAdjustmentPromises])

  return {
    tokenAdjustments,
    chainBalanceAdjustments,
    hTokenAdjustments
  }
}

function getAdjustedToken (tokenAdjustments: TokenAdjustmentData) {
  const {
    l1TokensInContract,
    l1Stake,
    l1TokensSentDirectlyToBridge,
    l1TransfersUnwithdrawn,
    l1RootsInvalid
  } = tokenAdjustments

  return l1TokensInContract
    .sub(l1Stake)
    .sub(l1TokensSentDirectlyToBridge)
    .sub(l1TransfersUnwithdrawn)
    .add(l1RootsInvalid)
}

function getAdjustedChainBalance (chainBalanceAdjustments: ChainBalanceAdjustmentData) {
  const {
    chainBalance,
    rootsBondedNotConfirmed
  } = chainBalanceAdjustments

  return chainBalance.sub(rootsBondedNotConfirmed)
}

function getAdjustedHToken (hTokenAdjustments: HTokenAdjustmentData) {
  const {
    hTokenTotalSupply,
    l2Stake,
    l2TransfersUnwithdrawn,
    l2TransfersPendingOutbound,
    l2TransfersInFlightFromL1ToL2,
    l2RootsInFlightOutbound,
    l2RootsInFlightInbound
  } = hTokenAdjustments

  return hTokenTotalSupply
    .add(l2Stake)
    .add(l2TransfersUnwithdrawn)
    .add(l2TransfersPendingOutbound)
    .add(l2TransfersInFlightFromL1ToL2)
    .add(l2RootsInFlightOutbound)
    .add(l2RootsInFlightInbound)
}

async function getTokenAdjustments (
  token: Token,
  l1Bridge: Contract,
  l1CanonicalToken: Contract,
  metaBlockData: Record<string, MetaBlockData>
): Promise<TokenAdjustmentData> {
  // Constants
  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l1BridgeAddress = l1Bridge.address
  const {
    blockTag,
    blockTimestamp
  } = metaBlockData[Chain.Ethereum]

  // Tokens in contract
  let l1TokensInContract: BigNumber = BigNumber.from('0')
  if (token === Token.ETH) {
    l1TokensInContract = await l1Provider.getBalance(l1BridgeAddress, blockTag)
  } else {
    l1TokensInContract = await l1CanonicalToken.balanceOf(l1BridgeAddress, { blockTag })
  }

  // L1 stake
  const l1Stake: BigNumber = await getAllBonderStakes(l1Bridge, blockTag)

  // Unwithdrawn transfers to L1
  // NOTE: The end timestamp in this function is meant to be for each individual L2. Since this function
  // does not care for that level of granularity, we can just use the same timestamp for all L2s.
  const l1UnwithdrawnTransfersNew = await getUnwithdrawnTransfers({
    token,
    chain: Chain.Ethereum,
    startTimestamp: ChainBalanceArchiveData.ArchiveDataTimestamp,
    endTimestamp: blockTimestamp
  })
  const l1UnwithdrawnTransfersArchive = ChainBalanceArchiveData.UnwithdrawnTransfers[token][Chain.Ethereum]
  const l1TransfersUnwithdrawn = l1UnwithdrawnTransfersNew.add(l1UnwithdrawnTransfersArchive!)

  // Invalid roots
  const l1RootsInvalid = BigNumber.from(ChainBalanceArchiveData.L1InvalidRoot[token]!)

  // Tokens sent directly to the L1 bridge address
  const l1TokensSentDirectlyToBridge = BigNumber.from(ChainBalanceArchiveData.L1TokensSentDirectlyToBridge[token]!)

  return {
    l1TokensInContract,
    l1Stake,
    l1TransfersUnwithdrawn,
    l1RootsInvalid,
    l1TokensSentDirectlyToBridge
  }
}

async function getChainBalanceAdjustments (
  token: Token,
  chain: Chain,
  l1Bridge: Contract,
  metaBlockData: Record<string, MetaBlockData>
): Promise<ChainBalanceAdjustmentData> {
  // Constants
  const chainId = chainSlugToId(chain)

  // ChainBalance
  const { blockTag: l1BlockTag } = metaBlockData[Chain.Ethereum]
  const chainBalance = await l1Bridge.chainBalance(chainId, { blockTag: l1BlockTag })

  // Bonded but unconfirmed roots
  // NOTE: Roots that have been committed but neither bonded nor confirmed will be included in inFlightOutboundRoots
  const rootsBondedNotConfirmed: BigNumber = await getBondedUnconfirmedRoots({
    token,
    chain
  })

  return {
    chain,
    chainBalance,
    rootsBondedNotConfirmed
  }
}

async function getHTokenAdjustments (
  token: Token,
  chain: Chain,
  l2ChainsForToken: string[],
  metaBlockData: Record<string, MetaBlockData>
): Promise<HTokenAdjustmentData> {
  // Constants
  const chainId = chainSlugToId(chain)
  const { l2Bridge, l2HopBridgeToken } = contracts.get(token, chain)
  const {
    blockTag,
    blockTimestamp: l2BlockTimestamp
  } = metaBlockData[chain]

  // hToken total supply
  const hTokenTotalSupply = await l2HopBridgeToken.totalSupply({ blockTag })

  // L2 stake
  const l2Stake: BigNumber = await getAllBonderStakes(l2Bridge, blockTag)

  // Unwithdrawn transfers
  const l2UnwithdrawnTransfersNew = await getUnwithdrawnTransfers({
    token,
    chain,
    startTimestamp: ChainBalanceArchiveData.ArchiveDataTimestamp,
    blockTag
  })
  const l2UnwithdrawnTransfersArchive = ChainBalanceArchiveData.UnwithdrawnTransfers[token][chain]
  const l2TransfersUnwithdrawn = l2UnwithdrawnTransfersNew.add(l2UnwithdrawnTransfersArchive!)

  // Pending outgoing tokens
  let l2TransfersPendingOutbound: BigNumber = BigNumber.from('0')
  const allSupportedChains = [Chain.Ethereum, ...l2ChainsForToken]
  for (const supportedChain of allSupportedChains) {
    if (supportedChain === chain) continue

    const destinationChainId = chainSlugToId(supportedChain)
    const pendingAmountForL2ChainId = await l2Bridge.pendingAmountForChainId(destinationChainId, { blockTag })
    l2TransfersPendingOutbound = l2TransfersPendingOutbound.add(pendingAmountForL2ChainId)
  }

  // L1 to L2 in flight inbound transfers
  // NOTE: Because block times across chains vary, we need to get the timestamp of both L1 and L2
  // so that we remain consistent with the state of each chain
  const { blockTimestamp: l1BlockTimestamp } = metaBlockData[Chain.Ethereum]
  const l2TransfersInFlightFromL1ToL2New: BigNumber = await getRecentUnrelayedL1ToL2Transfers(
    token,
    chain,
    l1BlockTimestamp,
    l2BlockTimestamp
  )
  const l2TransfersInFlightFromL1ToL2Archive = ChainBalanceArchiveData.InFlightL1ToL2Transfers[token][chain]
  const l2TransfersInFlightFromL1ToL2 = l2TransfersInFlightFromL1ToL2New.add(l2TransfersInFlightFromL1ToL2Archive!)

  const {
    allRootsCommitted,
    rootHashesSeenOnL1,
    rootHashesSetOnL2
  } = await getAllPossibleInFlightRoots(
    token,
    chain,
    l2ChainsForToken,
    metaBlockData
  )

  // In flight outbound roots
  let l2RootsInFlightOutbound: BigNumber = BigNumber.from('0')
  for (const rootHash in allRootsCommitted) {
    const root = allRootsCommitted[rootHash]

    if (root.sourceChainId !== chainId) continue
    if (rootHashesSeenOnL1.includes(rootHash)) continue

    l2RootsInFlightOutbound = l2RootsInFlightOutbound.add(root.totalAmount)
  }

  // In flight inbound roots
  // NOTE: When a root is set, the amount is converted from l2RootsInFlightInbound to l2TransfersUnwithdrawn. That
  // is why we check for set instead of settled.
  let l2RootsInFlightInbound: BigNumber = BigNumber.from('0')
  for (const rootHash in allRootsCommitted) {
    const root = allRootsCommitted[rootHash]

    if (root.destinationChainId !== chainId) continue
    if (!rootHashesSeenOnL1.includes(rootHash)) continue
    if (rootHashesSetOnL2.includes(rootHash)) continue

    l2RootsInFlightInbound = l2RootsInFlightInbound.add(root.totalAmount)
  }

  return {
    chain,
    hTokenTotalSupply,
    l2Stake,
    l2TransfersUnwithdrawn,
    l2TransfersPendingOutbound,
    l2TransfersInFlightFromL1ToL2,
    l2RootsInFlightOutbound,
    l2RootsInFlightInbound
  }
}

async function getAllBonderStakes (bridge: Contract, blockTag: providers.BlockTag): Promise<BigNumber> {
  let totalStake = BigNumber.from('0')
  const allBonderAddresses: string[] = getAllBonderAddresses()
  for (const bonderAddress of allBonderAddresses) {
    const [credit, rawDebit] = await Promise.all([
      bridge.getCredit(bonderAddress, { blockTag }),
      bridge.getRawDebit(bonderAddress, { blockTag })
    ])
    const stake = credit.sub(rawDebit)
    totalStake = totalStake.add(stake)
  }

  return totalStake
}

function getAllBonderAddresses (): string[] {
  const activeBonders: string[] = []
  const activeBonderData: any = globalConfig.bonders
  for (const token in activeBonderData) {
    const tokenData = activeBonderData[token]
    for (const sourceChainData in tokenData) {
      const sourceChain = tokenData[sourceChainData]
      for (const destinationChain in sourceChain) {
        const bonderAddress = sourceChain[destinationChain]
        if (activeBonders.includes(bonderAddress)) continue
        activeBonders.push(bonderAddress)
      }
    }
  }
  return [
    ...activeBonders,
    ...inactiveBonders
  ]
}

async function getAllPossibleInFlightRoots (
  token: string,
  chain: string,
  l2ChainsForToken: string[],
  metaBlockData: Record<string, MetaBlockData>
) {
  // We need to ensure we use the correct timestamp for each chain
  let { blockTimestamp: l1BlockTimestamp } = metaBlockData[Chain.Ethereum]
  let { blockTimestamp: l2BlockTimestampForChain } = metaBlockData[chain]
  l1BlockTimestamp = Number(l1BlockTimestamp)
  l2BlockTimestampForChain = Number(l2BlockTimestampForChain)
  
  const archiveDataTimestamp: number = ChainBalanceArchiveData.ArchiveDataTimestamp

  // Get all roots seen on L1
  const l1RootsConfirmed = await getTransferRootConfirmed(Chain.Ethereum, token, archiveDataTimestamp, l1BlockTimestamp)
  const l1RootsBonded = await getTransferRootBonded(Chain.Ethereum, token, archiveDataTimestamp, l1BlockTimestamp)
  const l1RootHashesConfirmed = l1RootsConfirmed.map((l1RootConfirmed: any) => l1RootConfirmed.rootHash)
  const l1RootHashesBonded = l1RootsBonded.map((l1RootBonded: any) => l1RootBonded.root)
  const rootHashesSeenOnL1 = l1RootHashesConfirmed.concat(l1RootHashesBonded)

  // Get all roots settled on L2
  const l2RootsSet = await getTransferRootSet(chain, token, archiveDataTimestamp, l2BlockTimestampForChain)
  const rootHashesSetOnL2 = l2RootsSet.map((root: any) => root.rootHash)

  // Get all roots committed on L2 in the given time. Add the sourceChainId to the object for convenience
  const allRootsCommitted: Record<string, any> = {}
  for (const l2SourceChain of l2ChainsForToken) {
    const sourceChainId = chainSlugToId(l2SourceChain)
    const sourceChainTimestamp = Number(metaBlockData[l2SourceChain].blockTimestamp)

    // This represents all destination chainIds
    const destinationChainId = 0
    const rootsCommitted = await getTransfersCommitted(l2SourceChain, token, destinationChainId, archiveDataTimestamp, sourceChainTimestamp)
    for (const rootCommitted of rootsCommitted) {
      allRootsCommitted[rootCommitted.rootHash] = rootCommitted
      allRootsCommitted[rootCommitted.rootHash].sourceChainId = sourceChainId
    }
  }

  return {
    allRootsCommitted,
    rootHashesSeenOnL1,
    rootHashesSetOnL2
  }
}

function logValues (
  token: Token,
  tokenAdjustments: TokenAdjustmentData,
  chainBalanceAdjustments: ChainBalanceAdjustmentData[],
  hTokenAdjustments: HTokenAdjustmentData[],
  metaBlockData: Record<string, MetaBlockData>
): void {
  const decimals: number = getTokenDecimals(token)

  console.log(`\n\n${token} Logs`)
  console.log(`MetaBlockData: ${JSON.stringify(metaBlockData)}`)

  const {
    l1TokensInContract,
    l1Stake,
    l1TokensSentDirectlyToBridge,
    l1TransfersUnwithdrawn,
    l1RootsInvalid
  } = tokenAdjustments
  console.log('\n\nToken Adjustments\n', {
    tokenAdjustments: {
      l1TokensInContract: ethersUtils.formatUnits(l1TokensInContract, decimals),
      l1Stake: ethersUtils.formatUnits(l1Stake, decimals),
      l1TokensSentDirectlyToBridge: ethersUtils.formatUnits(l1TokensSentDirectlyToBridge, decimals),
      l1TransfersUnwithdrawn: ethersUtils.formatUnits(l1TransfersUnwithdrawn, decimals),
      l1RootsInvalid: ethersUtils.formatUnits(l1RootsInvalid, decimals)
    }
  })

  const totalAdjustedToken: BigNumber = getAdjustedToken(tokenAdjustments)
  let totalAdjustedChainBalance: BigNumber = BigNumber.from(0)
  let totalAdjustedHToken: BigNumber = BigNumber.from(0)
  for (let i = 0; i < chainBalanceAdjustments.length; i++) {
    const {
      chain,
      chainBalance,
      rootsBondedNotConfirmed
    } = chainBalanceAdjustments[i]

    console.log(`\n\n${chain} ChainBalance Adjustments\n`, {
      chainBalanceAdjustments: {
        chainBalance: ethersUtils.formatUnits(chainBalance, decimals),
        rootsBondedNotConfirmed: ethersUtils.formatUnits(rootsBondedNotConfirmed, decimals)
      }
    })

    const {
      hTokenTotalSupply,
      l2Stake,
      l2TransfersUnwithdrawn,
      l2TransfersPendingOutbound,
      l2TransfersInFlightFromL1ToL2,
      l2RootsInFlightOutbound,
      l2RootsInFlightInbound
    } = hTokenAdjustments[i]

    console.log(`\n\n${chain} hToken Adjustments\n`, {
      hTokenBalanceAdjustments: {
        hTokenTotalSupply: ethersUtils.formatUnits(hTokenTotalSupply, decimals),
        l2Stake: ethersUtils.formatUnits(l2Stake, decimals),
        l2TransfersUnwithdrawn: ethersUtils.formatUnits(l2TransfersUnwithdrawn, decimals),
        l2TransfersPendingOutbound: ethersUtils.formatUnits(l2TransfersPendingOutbound, decimals),
        l2TransfersInFlightFromL1ToL2: ethersUtils.formatUnits(l2TransfersInFlightFromL1ToL2, decimals),
        l2RootsInFlightOutbound: ethersUtils.formatUnits(l2RootsInFlightOutbound, decimals),
        l2RootsInFlightInbound: ethersUtils.formatUnits(l2RootsInFlightInbound, decimals)
      }
    })

    const adjustedChainBalance = getAdjustedChainBalance(chainBalanceAdjustments[i])
    const adjustedHToken = getAdjustedHToken(hTokenAdjustments[i])

    console.log('\n')
    console.log(chain, 'adjustedChainBalance', ethersUtils.formatUnits(adjustedChainBalance, decimals))
    console.log(chain, 'adjustedHToken', ethersUtils.formatUnits(adjustedHToken, decimals))
    console.log(chain, 'diff', ethersUtils.formatUnits(adjustedChainBalance.sub(adjustedHToken), decimals))

    totalAdjustedChainBalance = totalAdjustedChainBalance.add(adjustedChainBalance)
    totalAdjustedHToken = totalAdjustedHToken.add(adjustedHToken)
  }

  console.log(`\n\nFinal Values for ${token}`)
  console.log('Adjusted Token:', ethersUtils.formatUnits(totalAdjustedToken, decimals))
  console.log('Adjusted ChainBalance:', ethersUtils.formatUnits(totalAdjustedChainBalance, decimals))
  console.log('Adjusted hToken:', ethersUtils.formatUnits(totalAdjustedHToken, decimals))

  const tokenChainBalanceDiff = totalAdjustedToken.sub(totalAdjustedChainBalance)
  const chainBalanceHTokenDiff = totalAdjustedChainBalance.sub(totalAdjustedHToken)
  console.log('\nCanonical Token - ChainBalance:', ethersUtils.formatUnits(tokenChainBalanceDiff, decimals))
  console.log('ChainBalance - hToken:', ethersUtils.formatUnits(chainBalanceHTokenDiff, decimals))

  // Log possible reasons why values might be wrong
  if (tokenChainBalanceDiff.isNegative()) {
    console.log('Token - ChainBalance is negative. Did someone withdraw tokens that existed in the UnwithdrawnTransfers archive data')
  }
}

async function getIsSubgraphSynced (
  metaBlockData: any,
  l1Provider: providers.Provider,
  l2Providers: Record<string, providers.Provider>
): Promise<boolean> {
  for (const chain in metaBlockData) {
    if (chain === Chain.Nova) {
      // Nova does not have a sync subgraph
      continue
    }

    const provider = chain === Chain.Ethereum ? l1Provider : l2Providers[chain]

    // Use timestamp since ORUs have inconsistent block lengths
    const syncedBlockNumber = await getSubgraphLastBlockSynced(chain)
    const syncedBlock = await provider.getBlock(syncedBlockNumber)
    if (!syncedBlock) {
      console.log(`Unable to get synced block for ${chain}, block number ${syncedBlockNumber}`)
      return false
    }

    const syncedTimestamp = syncedBlock.timestamp
    const syncDiff = metaBlockData[chain].blockTimestamp - syncedTimestamp

    const oneMinuteSeconds = 60
    if (syncDiff > oneMinuteSeconds) {
      console.log(chain, 'Subgraph is out of sync by', syncDiff, 'seconds. Please wait for the subgraph to sync before trying again.')
      return false
    }
  }
  return true
}
