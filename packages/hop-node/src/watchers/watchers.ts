import AvailableLiquidityWatcher from '#watchers/AvailableLiquidityWatcher.js'
import BondTransferRootWatcher from '#watchers/BondTransferRootWatcher.js'
import BondWithdrawalWatcher from '#watchers/BondWithdrawalWatcher.js'
import ChallengeWatcher from '#watchers/ChallengeWatcher.js'
import CommitTransfersWatcher from '#watchers/CommitTransfersWatcher.js'
import ConfirmRootsWatcher from '#watchers/ConfirmRootsWatcher.js'
import { Logger } from '@hop-protocol/hop-node-core/logger'
import RelayWatcher from '#watchers/RelayWatcher.js'
import SettleBondedWithdrawalWatcher from '#watchers/SettleBondedWithdrawalWatcher.js'
import SyncWatcher from '#watchers/SyncWatcher.js'
import { chainIdToSlug } from '@hop-protocol/hop-node-core/utils'
import { chainSlugToId } from '@hop-protocol/hop-node-core/utils'
import contracts from '#contracts/index.js'
import { BridgeContract } from '#watchers/classes/BaseWatcher.js'
import { Chain } from '@hop-protocol/hop-node-core/constants'
import { MetricsServer } from '@hop-protocol/hop-node-core/metrics'
import { Watchers, getAllChains, getAllTokens, config as globalConfig } from '#config/index.js'

const logger = new Logger('config')

const WatcherClasses: Record<string, any> = {
  [Watchers.BondTransferRoot]: BondTransferRootWatcher,
  [Watchers.BondWithdrawal]: BondWithdrawalWatcher,
  [Watchers.Challenge]: ChallengeWatcher,
  [Watchers.CommitTransfers]: CommitTransfersWatcher,
  [Watchers.SettleBondedWithdrawals]: SettleBondedWithdrawalWatcher,
  [Watchers.ConfirmRoots]: ConfirmRootsWatcher,
  [Watchers.L1ToL2Relay]: RelayWatcher
}

type Watcher = BondTransferRootWatcher | BondWithdrawalWatcher | ChallengeWatcher | CommitTransfersWatcher | SettleBondedWithdrawalWatcher | ConfirmRootsWatcher | SyncWatcher | AvailableLiquidityWatcher | RelayWatcher

type CommitTransfersMinThresholdAmounts = {
  [token: string]: any
}

type BondWithdrawalAmounts = {
  [token: string]: any
}

type SettleBondedWithdrawalsThresholdPercent = {
  [token: string]: any
}

type GetWatchersConfig = {
  enabledWatchers?: string[]
  tokens?: string[]
  networks?: string[]
  commitTransfersMinThresholdAmounts?: CommitTransfersMinThresholdAmounts
  settleBondedWithdrawalsThresholdPercent?: SettleBondedWithdrawalsThresholdPercent
  dryMode?: boolean
  syncFromDate?: string
  s3Upload?: boolean
  s3Namespace?: string
}

type GetChallengeWatchersConfig = {
  tokens?: string[]
  networks?: string[]
  dryMode?: boolean
}

type GetWatcherConfig = {
  chain?: string
  token: string
  dryMode: boolean
  watcherName?: string
}

type GetSiblingWatchersConfig = {
  networks: string[]
  tokens: string[]
}

type GetSiblingWatchersCbConfig = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: BridgeContract
  isL1: boolean
}

export async function getWatchers (config: GetWatchersConfig) {
  const {
    enabledWatchers = [],
    tokens = getAllTokens(),
    networks = getAllChains(),
    commitTransfersMinThresholdAmounts = {},
    settleBondedWithdrawalsThresholdPercent = {},
    dryMode = false,
    syncFromDate,
    s3Upload,
    s3Namespace
  } = config

  const watchers: Watcher[] = []
  logger.debug(`enabled watchers: ${enabledWatchers.join(',')}`)

  if (enabledWatchers.includes(Watchers.BondWithdrawal)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      return new BondWithdrawalWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.SettleBondedWithdrawals)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      return new SettleBondedWithdrawalWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        dryMode,
        minThresholdPercent: settleBondedWithdrawalsThresholdPercent?.[tokenSymbol]
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.CommitTransfers)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      const minThresholdAmounts = commitTransfersMinThresholdAmounts?.[tokenSymbol]?.[chainSlug]

      return new CommitTransfersWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        minThresholdAmounts,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.BondTransferRoot)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      return new BondTransferRootWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.ConfirmRoots)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      if (isL1) {
        return
      }
      const l1BridgeContract = contracts.get(tokenSymbol, Chain.Ethereum)?.l1Bridge
      if (!l1BridgeContract) {
        return
      }
      return new ConfirmRootsWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        l1BridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.L1ToL2Relay)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      return new RelayWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.Challenge)) {
    watchers.push(...getChallengeWatchers({
      tokens,
      networks,
      dryMode
    }))
  }

  const syncWatchers = getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
    const gasCostPollEnabled = enabledWatchers.includes(Watchers.BondWithdrawal)

    return new SyncWatcher({
      chainSlug,
      tokenSymbol,
      bridgeContract,
      syncFromDate,
      gasCostPollEnabled
    })
  })

  watchers.push(...syncWatchers)

  for (const watcher of watchers) {
    const { chainSlug, tokenSymbol } = watcher.bridge
    watcher.setSyncWatcher(
      findWatcher(
        syncWatchers,
        SyncWatcher,
        chainSlug,
        tokenSymbol
      ) as SyncWatcher
    )
  }

  const availableLiquidityWatchers = getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
    return new AvailableLiquidityWatcher({
      chainSlug,
      tokenSymbol,
      bridgeContract,
      s3Upload,
      s3Namespace
    })
  })

  watchers.push(...availableLiquidityWatchers)

  for (const watcher of watchers) {
    const { chainSlug, tokenSymbol } = watcher.bridge
    watcher.setAvailableLiquidityWatcher(
      findWatcher(
        availableLiquidityWatchers,
        AvailableLiquidityWatcher,
        chainSlug,
        tokenSymbol
      ) as AvailableLiquidityWatcher
    )
  }

  if (globalConfig.metrics?.enabled) {
    await new MetricsServer(globalConfig.metrics?.port).start()
  }

  return watchers
}

export async function startWatchers (config: GetWatchersConfig) {
  const watchers = await getWatchers(config)
  const starts = watchers.map(async (watcher: Watcher) => watcher.start())
  const stop = () => {
    return watchers.map(async (watcher: Watcher) => {
      return watcher.stop()
    })
  }

  return { starts, stop, watchers }
}

export function startChallengeWatchers (config: GetChallengeWatchersConfig) {
  const watchers = getChallengeWatchers(config)
  watchers.forEach(async (watcher: Watcher) => watcher.start())
  const stop = () => {
    return watchers.map(async (watcher: Watcher) => {
      return watcher.stop()
    })
  }

  return { stop, watchers }
}

function getChallengeWatchers (config: GetChallengeWatchersConfig) {
  const {
    tokens = getAllTokens(),
    networks = getAllChains(),
    dryMode = false
  } = config

  const watchers = getSiblingWatchers({ networks, tokens }, ({ chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
    return new ChallengeWatcher({
      chainSlug,
      bridgeContract,
      tokenSymbol,
      dryMode
    })
  })

  return watchers
}

function getSiblingWatchers (config: GetSiblingWatchersConfig, init: (conf: GetSiblingWatchersCbConfig) => Watcher | undefined) {
  const {
    tokens = getAllTokens(),
    networks = getAllChains()
  } = config
  const watchers: {[token: string]: {[chainId: string]: Watcher}} = {}
  const list: Watcher[] = []

  const filteredSourceChains = new Set()
  const filteredDestinationChains = new Set()
  for (const sourceChain in globalConfig.routes) {
    filteredSourceChains.add(sourceChain)
    for (const destinationChain in globalConfig.routes[sourceChain]) {
      filteredDestinationChains.add(destinationChain)
    }
  }

  for (const tokenSymbol of tokens) {
    for (const chainSlug of networks) {
      const isL1 = chainSlug === Chain.Ethereum
      const chainId = chainSlugToId(chainSlug)
      if (!contracts.has(tokenSymbol, chainSlug)) {
        continue
      }

      const tokenContracts = contracts.get(tokenSymbol, chainSlug)
      let bridgeContract = tokenContracts.l2Bridge
      let tokenContract = tokenContracts.l2HopBridgeToken
      if (isL1) {
        bridgeContract = tokenContracts.l1Bridge
        tokenContract = tokenContracts.l1CanonicalToken
      }

      const watcher = init({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        isL1
      })
      if (!watcher) {
        continue
      }

      const slug = chainIdToSlug(chainId)

      // Skip watcher if it's not specified as route
      if (!(filteredSourceChains.has(slug) || filteredDestinationChains.has(slug))) {
        // The SyncWatcher and the BondTransferRootWatcher should always run the L1 watcher regardless of route
        if (
          !((isL1 && (watcher instanceof SyncWatcher || watcher instanceof BondTransferRootWatcher)))
        ) {
          continue
        }
      }

      watchers[tokenSymbol] = watchers[tokenSymbol] || {}
      watchers[tokenSymbol][chainId] = watcher
      list.push(watcher)
    }
  }

  for (const tokenSymbol in watchers) {
    for (const chainSlug in watchers[tokenSymbol]) {
      watchers[tokenSymbol][chainSlug].setSiblingWatchers(watchers[tokenSymbol])
    }
  }

  return list
}

export function findWatcher (watchers: Watcher[], WatcherType: any, chain?: string, token?: string) {
  return watchers.find((watcher: Watcher) => {
    if (!(watcher instanceof WatcherType)) {
      return null
    }
    if (chain && watcher.chainSlug !== chain) {
      return null
    }
    if (token && watcher.tokenSymbol !== token) {
      return null
    }
    return watcher
  })
}

export async function getWatcher (config: GetWatcherConfig): Promise<Watcher> {
  const { chain, token, dryMode, watcherName } = config
  const watchers = await getWatchers({
    enabledWatchers: [watcherName!],
    tokens: [token],
    dryMode
  })

  const WatcherClass = WatcherClasses[watcherName!]
  const watcher = findWatcher(watchers, WatcherClass, chain)
  if (!watcher) {
    throw new Error(`Watcher not found for chain ${chain} and token ${token}`)
  }
  return watcher
}

export async function getBondTransferRootWatcher (config: GetWatcherConfig): Promise<BondTransferRootWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.BondTransferRoot })) as BondTransferRootWatcher
}

export async function getBondWithdrawalWatcher (config: GetWatcherConfig): Promise<BondWithdrawalWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.BondWithdrawal })) as BondWithdrawalWatcher
}

export async function getCommitTransfersWatcher (config: GetWatcherConfig): Promise<CommitTransfersWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.CommitTransfers })) as CommitTransfersWatcher
}

export async function getConfirmRootsWatcher (config: GetWatcherConfig): Promise<ConfirmRootsWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.ConfirmRoots })) as ConfirmRootsWatcher
}

export async function getSettleBondedWithdrawalsWatcher (config: GetWatcherConfig): Promise<SettleBondedWithdrawalWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.SettleBondedWithdrawals })) as SettleBondedWithdrawalWatcher
}

export async function getL1ToL2RelayWatcher (config: GetWatcherConfig): Promise<RelayWatcher> {
  return (await getWatcher({ ...config, watcherName: Watchers.L1ToL2Relay })) as RelayWatcher
}

export async function getSyncWatcher (config: GetWatcherConfig): Promise<SyncWatcher> {
  return (await getBondWithdrawalWatcher(config)).syncWatcher
}
