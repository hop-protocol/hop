import { actionHandler, parseString, root } from './shared'
import { BigNumber, Contract, providers, utils as ethersUtils } from 'ethers'
import { DateTime } from 'luxon'
import { config as globalConfig } from 'src/config'
import { Chain } from 'src/constants'
import contracts from 'src/contracts'
import chainSlugToId from 'src/utils/chainSlugToId'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getMultipleWithdrawalsSettled from 'src/theGraph/getMultipleWithdrawalsSettled'

import { getRecentUnrelayedL1ToL2Transfers } from './shared/utils'

import { main as getUnwithdrawnTransfers } from './unwithdrawnTransfers'
import { main as getBondedUnconfirmedRoots } from './bondedUnconfirmedRoots'

const ArchiveDataTimestamp = 1680764400
const blockTags: Record<string, providers.BlockTag> = {}

const Tokens = {
  USDC: 'USDC',
  USDT: 'USDT',
  DAI: 'DAI',
  ETH: 'ETH',
  MATIC: 'MATIC',
  HOP: 'HOP',
}

interface L1TokenAdjustments {
  l1TokensInContract: BigNumber
  l1Stake: BigNumber
  l1UnwithdrawnTransfers: BigNumber
  l1InvalidRoots: BigNumber
  l1TokensSentDirectlyToBridge: BigNumber
}

interface L2ChainData {
  [supportedL2Chain: string]: {
    chainBalance: BigNumber
    hTokenTotalSupply: BigNumber
    l2UnwithdrawnTransfers: BigNumber
    bondedUnconfirmedRootAmount: BigNumber
    l2Stake: BigNumber
    transfers_pendingOutbound: BigNumber
    transfers_inFlightFromL1ToL2: BigNumber
    inFlightInboundRoots: BigNumber
    inFlightOutboundRoots: BigNumber
  }
}

const inactiveBonders = [
  '0x2A6303e6b99d451Df3566068EBb110708335658f',
  '0x305933e09871D4043b5036e09af794FACB3f6170',
  '0x9137a628546e2b1bc26F60A5D1262fb6D58eA44A',
  '0x15ec4512516d980090050fe101de21832c8edfee',
  '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
  '0xad103c0928acfde91dfd4e9e21225bcf9c7cbe62',
  '0x924AC9910C09A0215b06458653b30471A152022F',
]

root
  .command('verify-chain-balance')
  .description('Verify chain balance')
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { token } = source

  if (!token) {
    throw new Error('token is required')
  }

  console.log(`Verifying chain balance for ${token} with an archive timestamp of ${ArchiveDataTimestamp} (${DateTime.fromSeconds(ArchiveDataTimestamp).toISO()})`)

  // Get constants
  const supportedL2ChainsForToken: string[] = []
  for (const chain in globalConfig.addresses[token]) {
    if (chain === Chain.Ethereum) continue
     supportedL2ChainsForToken.push(chain)
  }

  const l1Provider = getRpcProvider(Chain.Ethereum)!
  blockTags[Chain.Ethereum] = await l1Provider.getBlockNumber()
  const decimals: number = getTokenDecimals(token)
  const l2Providers: Record<string, providers.Provider> = {}
  for (const supportedL2ChainForToken of supportedL2ChainsForToken) {
    const l2Provider = getRpcProvider(supportedL2ChainForToken)!
    l2Providers[supportedL2ChainForToken] = l2Provider
    blockTags[supportedL2ChainForToken] = await l2Provider.getBlockNumber()
  }

  // Get addresses
  const addresses = globalConfig.addresses[token]
  if (!addresses) {
    throw new Error('addresses not found')
  }

  const {
    l1Bridge,
    l1CanonicalToken
  } = contracts.get(token, Chain.Ethereum)

  const {
    l1TokensInContract,
    l1Stake,
    l1UnwithdrawnTransfers,
    l1InvalidRoots,
    l1TokensSentDirectlyToBridge,
  } = await getL1TokenAdjustments(
    token,
    l1Bridge,
    l1CanonicalToken,
    decimals
  )

  const promises: Array<Promise<L2ChainData>> = []
  for (const supportedL2ChainForToken of supportedL2ChainsForToken) {
    promises.push(getChainData(
      token,
      supportedL2ChainForToken,
      supportedL2ChainsForToken,
      l1Bridge,
      decimals
    ))
  }
  const l2ChainDatas: L2ChainData[] = await Promise.all([...promises])

  let adjustedToken = 
    l1TokensInContract
    .sub(l1Stake)
    .sub(l1UnwithdrawnTransfers)
    .add(l1InvalidRoots)
    .sub(l1TokensSentDirectlyToBridge)
  let adjustedChainBalance = BigNumber.from('0')
  let adjustedHTokenBalance = BigNumber.from('0')

  console.log('\n\nL1 Token Adjustments\n', {
    tokenAdjustments: {
      l1TokensInContract: ethersUtils.formatUnits(l1TokensInContract, decimals),
      l1Stake: ethersUtils.formatUnits(l1Stake, decimals),
      l1UnwithdrawnTransfers: ethersUtils.formatUnits(l1UnwithdrawnTransfers, decimals),
      l1InvalidRoots: ethersUtils.formatUnits(l1InvalidRoots, decimals),
      l1TokensSentDirectlyToBridge: ethersUtils.formatUnits(l1TokensSentDirectlyToBridge, decimals),
    }
  })
  
  // Calculate final values
  for (const l2ChainData of l2ChainDatas) {
    const supportedL2Chain = Object.keys(l2ChainData)[0]
    const {
      chainBalance,
      hTokenTotalSupply,
      l2UnwithdrawnTransfers,
      bondedUnconfirmedRootAmount,
      inFlightOutboundRoots,
      l2Stake,
      transfers_pendingOutbound,
      transfers_inFlightFromL1ToL2,
      inFlightInboundRoots
    } = l2ChainData[supportedL2Chain]

    console.log(`\n\n${supportedL2Chain} L2 Adjustments\n`, {
      chainBalanceAdjustments: {
        chainBalance: ethersUtils.formatUnits(chainBalance, decimals),
        bondedUnconfirmedRootAmount: ethersUtils.formatUnits(bondedUnconfirmedRootAmount, decimals),
      },
      hTokenBalanceAdjustments: {
        hTokenTotalSupply: ethersUtils.formatUnits(hTokenTotalSupply, decimals),
        l2UnwithdrawnTransfers: ethersUtils.formatUnits(l2UnwithdrawnTransfers, decimals),
        l2Stake: ethersUtils.formatUnits(l2Stake, decimals),
        transfers_pendingOutbound: ethersUtils.formatUnits(transfers_pendingOutbound, decimals),
        transfers_inFlightFromL1ToL2: ethersUtils.formatUnits(transfers_inFlightFromL1ToL2, decimals),
        inFlightOutboundRoots: ethersUtils.formatUnits(inFlightOutboundRoots, decimals),
        inFlightInboundRoots: ethersUtils.formatUnits(inFlightInboundRoots, decimals),
      }
    })

    const tokenAdjustments = BigNumber.from('0')
    const chainBalanceAdjustments =
      chainBalance
      .sub(bondedUnconfirmedRootAmount)
    const hTokenBalanceAdjustments = 
      hTokenTotalSupply
      .add(l2UnwithdrawnTransfers)
      .add(l2Stake)
      .add(transfers_pendingOutbound)
      .add(transfers_inFlightFromL1ToL2)
      .add(inFlightInboundRoots)
      .add(inFlightOutboundRoots)

    console.log('\n')
    console.log(supportedL2Chain, 'adjustedChainBalance', ethersUtils.formatUnits(chainBalanceAdjustments, decimals))
    console.log(supportedL2Chain, 'adjustedHTokenBalance', ethersUtils.formatUnits(hTokenBalanceAdjustments, decimals))
    console.log(supportedL2Chain, 'diff', ethersUtils.formatUnits(chainBalanceAdjustments.sub(hTokenBalanceAdjustments), decimals))

    adjustedToken = adjustedToken.add(tokenAdjustments) 
    adjustedChainBalance = adjustedChainBalance.add(chainBalanceAdjustments)
    adjustedHTokenBalance = adjustedHTokenBalance.add(hTokenBalanceAdjustments)
  }

  console.log(`\n\nFinal Values for ${token}`)
  console.log('\nToken in Contract:', ethersUtils.formatUnits(l1TokensInContract, decimals))
  console.log('Adjusted Token:', ethersUtils.formatUnits(adjustedToken, decimals))
  console.log('Adjusted ChainBalance:', ethersUtils.formatUnits(adjustedChainBalance, decimals))
  console.log('Adjusted hToken:', ethersUtils.formatUnits(adjustedHTokenBalance, decimals))

  console.log('\nCanonical Token - ChainBalance:', ethersUtils.formatUnits(adjustedToken.sub(adjustedChainBalance), decimals))
  console.log('ChainBalance - hToken:', ethersUtils.formatUnits(adjustedChainBalance.sub(adjustedHTokenBalance), decimals))
}

async function getL1TokenAdjustments (
  token: string,
  l1Bridge: Contract,
  l1CanonicalToken: Contract,
  decimals: number
): Promise<L1TokenAdjustments> {
  console.log(`Getting ${token} values for ethereum...`)

  // Constants
  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l1BridgeAddress = l1Bridge.address
  const blockTag = blockTags[Chain.Ethereum]

  // Tokens in contract
  let l1TokensInContract: BigNumber = BigNumber.from('0')
  if (token === Tokens.ETH) {
    l1TokensInContract = await l1Provider.getBalance(l1BridgeAddress, blockTag)
  } else {
    l1TokensInContract = await l1CanonicalToken.balanceOf(l1BridgeAddress, { blockTag })
  }

  // L1 stake
  let l1Stake: BigNumber = await getAllBonderStakes(l1Bridge, blockTag)

  // Unwithdrawn transfers to L1
  // Do not use a block tag here since there should be no unwithdrawn transfers and if there are they will
  // likely not occur at single-block granularity
  const l1UnwithdrawnTransfersArchive = getUnwithdrawnTransfersArchive(token, Chain.Ethereum, decimals)
  const l1UnwithdrawnTransfersNew = await getUnwithdrawnTransfers({
    token,
    chain: Chain.Ethereum,
    startTimestamp: ArchiveDataTimestamp,
  })
  const l1UnwithdrawnTransfers = l1UnwithdrawnTransfersArchive.add(l1UnwithdrawnTransfersNew)

  // Invalid roots
  const l1InvalidRoots = getL1InvalidRootArchive(token, decimals)

  // Tokens sent directly to the L1 bridge address
  const l1TokensSentDirectlyToBridge = getL1TokensSentDirectlyToBridgeArchive(token, decimals)

  return {
    l1TokensInContract,
    l1Stake,
    l1UnwithdrawnTransfers,
    l1InvalidRoots,
    l1TokensSentDirectlyToBridge,
  }
}

async function getChainData (
  token: string,
  supportedL2Chain: string,
  supportedL2ChainsForToken: string[],
  l1Bridge: Contract,
  decimals: number
): Promise<L2ChainData> {
  console.log(`Getting ${token} values for ${supportedL2Chain}...`)

  // Constants
  const supportedL2ChainId = chainSlugToId(supportedL2Chain)
  const { l2Bridge, l2HopBridgeToken } = contracts.get(token, supportedL2Chain)
  const blockTag = blockTags[supportedL2Chain]

  // ChainBalance
  const chainBalance = await l1Bridge.chainBalance(supportedL2ChainId, { blockTag: blockTags[Chain.Ethereum] })
  
  // Bonded but unconfirmed roots
  // NOTE: Roots that have been committed but neither bonded nor confirmed will be included in inFlightOutboundRoots
  const bondedUnconfirmedRootAmount: BigNumber = await getBondedUnconfirmedRoots({
    token,
    chain: supportedL2Chain,
  })

  // hToken total supply
  const hTokenTotalSupply = await l2HopBridgeToken.totalSupply({ blockTag })

  // Unwithdrawn transfers on the chain
  const l2UnwithdrawnTransfersArchive = getUnwithdrawnTransfersArchive(token, supportedL2Chain, decimals)
  const l2UnwithdrawnTransfersNew = await getUnwithdrawnTransfers({
    token,
    chain: supportedL2Chain,
    startTimestamp: ArchiveDataTimestamp,
  })
  const l2UnwithdrawnTransfers = l2UnwithdrawnTransfersArchive.add(l2UnwithdrawnTransfersNew)

  // L2 stake
  let l2Stake: BigNumber = await getAllBonderStakes(l2Bridge, blockTag)

  // Pending outgoing tokens
  let transfers_pendingOutbound: BigNumber = BigNumber.from('0')
  const allSupportedChains = [Chain.Ethereum, ...supportedL2ChainsForToken]
  for (const supportedChains of allSupportedChains) {
    if (supportedChains === supportedL2Chain) continue

    const destinationChainId = chainSlugToId(supportedChains)
    const pendingAmountForL2ChainId = await l2Bridge.pendingAmountForChainId(destinationChainId, { blockTag })
    transfers_pendingOutbound = transfers_pendingOutbound.add(pendingAmountForL2ChainId)
  }

  // L1 to L2 in flight inbound transfers
  // NOTE: Because block times across chains vary, we need to get the timestamp of both the L1 blockTag and
  // the L2 blockTag so that we remain consistent with the state of each chain
  const transfers_inFlightFromL1ToL2Archive = getInFlightL1ToL2TransfersArchive(token, supportedL2Chain, decimals)
  const l1BlockTimestamp = (await l1Bridge.provider.getBlock(blockTags[Chain.Ethereum])).timestamp
  const l2BlockTimestamp = (await l2Bridge.provider.getBlock(blockTag)).timestamp
  const transfers_inFlightFromL1ToL2New: BigNumber = await getRecentUnrelayedL1ToL2Transfers(
    token,
    supportedL2Chain,
    l1BlockTimestamp,
    l2BlockTimestamp
  )
  const transfers_inFlightFromL1ToL2 = transfers_inFlightFromL1ToL2Archive.add(transfers_inFlightFromL1ToL2New)

  const {
    allRootsCommitted,
    rootHashesSeenOnL1,
    l2RootHashesSettled
  } = await getAllPossibleInFlightRoots(token, supportedL2Chain, supportedL2ChainsForToken)

  // In flight outbound roots
  let inFlightOutboundRoots: BigNumber = BigNumber.from('0')
  for (const rootHash in allRootsCommitted) {
    const root = allRootsCommitted[rootHash]

    if (root.sourceChainId !== supportedL2ChainId) continue
    if (rootHashesSeenOnL1.includes(rootHash)) continue

    inFlightOutboundRoots = inFlightOutboundRoots.add(root.totalAmount)
  }

  // In flight inbound roots
  let inFlightInboundRoots: BigNumber = BigNumber.from('0')
  for (const rootHash in allRootsCommitted) {
    const root = allRootsCommitted[rootHash]

    if (root.destinationChainId !== supportedL2ChainId) continue
    if (!rootHashesSeenOnL1.includes(rootHash)) continue
    if (l2RootHashesSettled.includes(rootHash)) continue

    inFlightInboundRoots = inFlightInboundRoots.add(root.totalAmount)
  }

  return {
    [supportedL2Chain]: {
      chainBalance,
      hTokenTotalSupply,
      l2UnwithdrawnTransfers,
      bondedUnconfirmedRootAmount,
      inFlightOutboundRoots,
      l2Stake,
      transfers_pendingOutbound,
      transfers_inFlightFromL1ToL2,
      inFlightInboundRoots
    }
  }
}

async function getAllBonderStakes (bridge: Contract, blockTag: providers.BlockTag): Promise<BigNumber> {
  let totalStake = BigNumber.from('0')
  const allBonderAddresses: string[] = getAllBonderAddresses()
  for (const bonderAddress of allBonderAddresses) {
    const credit = await bridge.getCredit(bonderAddress, { blockTag })
    const rawDebit = await bridge.getRawDebit(bonderAddress, { blockTag })
    const stake = credit.sub(rawDebit)
    totalStake = totalStake.add(stake)
  }

  return totalStake
}

function getAllBonderAddresses (): string[] {
  let activeBonders: string[] = []
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

async function getAllPossibleInFlightRoots (token: string, chain: string, supportedL2ChainsForToken: string[]) {
  // Get all roots seen on L1
  const l1RootsConfirmed = await getTransferRootConfirmed(Chain.Ethereum, token, ArchiveDataTimestamp)
  const l1RootsBonded = await getTransferRootBonded(Chain.Ethereum, token, ArchiveDataTimestamp)
  const l1RootHashesConfirmed = l1RootsConfirmed.map((l1RootConfirmed: any) => l1RootConfirmed.rootHash)
  const l1RootHashesBonded = l1RootsBonded.map((l1RootBonded: any) => l1RootBonded.root)
  const rootHashesSeenOnL1 = l1RootHashesConfirmed.concat(l1RootHashesBonded)

  // Get all roots settled on L2
  const l2RootsSettled = await getMultipleWithdrawalsSettled(chain, token, ArchiveDataTimestamp)
  const l2RootHashesSettled = l2RootsSettled.map((root: any) => root.rootHash)

  // Get all roots committed on L2 in the given time. Add the sourceChainId to the object for convenience
  let allRootsCommitted: Record<string, any> = {}
  for (const l2SourceChain of supportedL2ChainsForToken) {
    const sourceChainId = chainSlugToId(l2SourceChain)

    // This represents all destination chainIds
    const destinationChainId = 0
    const rootsCommitted = await getTransfersCommitted(l2SourceChain, token, destinationChainId, ArchiveDataTimestamp)
    for (const rootCommitted of rootsCommitted) {
      allRootsCommitted[rootCommitted.rootHash] = rootCommitted
      allRootsCommitted[rootCommitted.rootHash].sourceChainId = sourceChainId
    }
  }

  return {
    allRootsCommitted,
    rootHashesSeenOnL1,
    l2RootHashesSettled
  }
}

function getUnwithdrawnTransfersArchive(token: string, chain: string, decimals: number): BigNumber {
  const amount: string = unwithdrawnTransfersArchive[token][chain]
  if (amount) {
    return ethersUtils.parseUnits(amount, decimals)
  }

  return BigNumber.from('0')
}

function getInFlightL1ToL2TransfersArchive(token: string, chain: string, decimals: number): BigNumber {
  const amount: string = inFlightL1ToL2TransfersArchive[token][chain]
  if (amount) {
    return ethersUtils.parseUnits(amount, decimals)
  }

  return BigNumber.from('0')
}

function getL1TokensSentDirectlyToBridgeArchive(token: string, decimals: number): BigNumber {
  const amount: string = l1TokensSentDirectlyToBridgeArchive[token]
  if (amount) {
    return ethersUtils.parseUnits(amount, decimals)
  }

  return BigNumber.from('0')
}

function getL1InvalidRootArchive(token: string, decimals: number): BigNumber {
  const amount: string = l1InvalidRootArchive[token]
  if (amount) {
    return ethersUtils.parseUnits(amount, decimals)
  }

  return BigNumber.from('0')
}

// These include Optimism pre-regenesis data
const unwithdrawnTransfersArchive: Record<string, Record<string, string>> = {
  [Tokens.USDC]: {
    [Chain.Ethereum]: '11620.914510', 
    [Chain.Gnosis]: '2367.407510',
    [Chain.Polygon]: '6.993141',
    [Chain.Optimism]: '608.591543',
    [Chain.Arbitrum]: '692.121447',
  },
  [Tokens.USDT]: {
    [Chain.Ethereum]: '284.726768',
    [Chain.Gnosis]: '5.970088',
    [Chain.Polygon]: '195.005308',
    [Chain.Optimism]: '509.262863',
    [Chain.Arbitrum]: '889.647236',
  },
  [Tokens.DAI]: {
    [Chain.Ethereum]: '5.999029419997878963',
    [Chain.Gnosis]: '0.000000000000999919',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '',
    [Chain.Arbitrum]: '1.997714748344663351',
  },
  [Tokens.ETH]: {
    [Chain.Ethereum]: '40.920460366015056002',
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0.000000000999134604',
    [Chain.Optimism]: '0.368535750741417793',
    [Chain.Arbitrum]: '3.317026780741394158',
    [Chain.Nova]: '0',
  },
  [Tokens.MATIC]: {
    [Chain.Ethereum]: '9.999612792838651812',
    [Chain.Gnosis]: '62.738218258539121055',
    [Chain.Polygon]: '0',
  },
  [Tokens.HOP]: {
    [Chain.Ethereum]: '19517.150197978387972096',
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '',
    [Chain.Arbitrum]: '0',
  },
}

// There are no Optimism pre-regenesis values here since all L1 to Optimism pre-regenesis transfers have been relayed
const inFlightL1ToL2TransfersArchive: Record<string, Record<string, string>> = {
  [Tokens.USDC]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0',
  },
  [Tokens.USDT]: {
    [Chain.Gnosis]: '0',
    // 0x2bf6c3b315f61c0ba330448866a338a28fb58d9f16d4c530580943b09024527e 2000000
    [Chain.Polygon]: '2',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0',
  },
  [Tokens.DAI]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0',
  },
  [Tokens.ETH]: {
    [Chain.Gnosis]: '0',
    // 0x94a4b0285ad866a8dd03035585b91daed0df2279cd1957a2d08157e490fecb0c, 1
    [Chain.Polygon]: '0.000000000000000001',
    [Chain.Optimism]: '0',
    // 0x29bd9e277ad5a9947de64b37a44677ca7f6ec795d1241589fd5a4a51056feafb, 1000000000000000
    // 0x72d13235de7ca9fba419c8662e14b0bec8fbe712f3a41d04172cf5b511d921ce, 50000000000000000
    [Chain.Arbitrum]: '0.051000000000000000',
    [Chain.Nova]: '0',
  },
  [Tokens.MATIC]: {
    [Chain.Gnosis]: '0',
    // 0x0d0812c30bbd1e409917638b0e8439cf0e0f98d66958ac9484f6dc5ea178a716, 1790041515271225938
    [Chain.Polygon]: '1.790041515271225938',
  },
  [Tokens.HOP]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0',
  },
}

const l1TokensSentDirectlyToBridgeArchive: Record<string, string> = {
  // 0x7b3aa56febe5c71ed6606988a4e12525cb722f35229828e906b7f7f1ad3a899c, 5
  // 0xa7eb6588cc3bef7d21c0bfdf911d32005983547ae30709b6ef968696aed00f68, 52.295549
  [Tokens.USDC]: '57.295549',
  [Tokens.USDT]: '0',
  [Tokens.DAI]: '0',
  [Tokens.ETH]: '0',
  [Tokens.MATIC]: '0',
  [Tokens.HOP]: '0',
}

const l1InvalidRootArchive: Record<string, string> = {
  [Tokens.USDC]: '10025.137464',
  [Tokens.USDT]: '0',
  [Tokens.DAI]: '0',
  [Tokens.ETH]: '38.497139540773520376',
  [Tokens.MATIC]: '0',
  [Tokens.HOP]: '0',
}

