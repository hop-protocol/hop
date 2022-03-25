import '../moduleAlias'
import AvailableLiquidityWatcher from 'src/watchers/AvailableLiquidityWatcher'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import CommitTransfersWatcher from 'src/watchers/CommitTransfersWatcher'
import Logger from 'src/logger'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import SyncWatcher from 'src/watchers/SyncWatcher'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import xDomainMessageRelayWatcher from 'src/watchers/xDomainMessageRelayWatcher'
import { BridgeContract } from 'src/watchers/classes/BaseWatcher'
import { Chain } from 'src/constants'
import { MetricsServer } from 'src/metrics'
import { Watchers, getAllChains, getAllTokens, config as globalConfig } from 'src/config'

const logger = new Logger('config')

const WatcherClasses: Record<string, any> = {
  [Watchers.BondTransferRoot]: BondTransferRootWatcher,
  [Watchers.BondWithdrawal]: BondWithdrawalWatcher,
  [Watchers.Challenge]: ChallengeWatcher,
  [Watchers.CommitTransfers]: CommitTransfersWatcher,
  [Watchers.SettleBondedWithdrawals]: SettleBondedWithdrawalWatcher,
  [Watchers.xDomainMessageRelay]: xDomainMessageRelayWatcher
}

type Watcher = BondTransferRootWatcher | BondWithdrawalWatcher | ChallengeWatcher | CommitTransfersWatcher | SettleBondedWithdrawalWatcher | xDomainMessageRelayWatcher | SyncWatcher | AvailableLiquidityWatcher

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

  if (enabledWatchers.includes(Watchers.xDomainMessageRelay)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, chainSlug, tokenSymbol, bridgeContract }: GetSiblingWatchersCbConfig) => {
      if (isL1) {
        return
      }
      const l1BridgeContract = contracts.get(tokenSymbol, Chain.Ethereum)?.l1Bridge
      if (!l1BridgeContract) {
        return
      }
      return new xDomainMessageRelayWatcher({
        chainSlug,
        tokenSymbol,
        bridgeContract,
        l1BridgeContract,
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
      return await watcher.stop()
    })
  }

  return { starts, stop, watchers }
}

export function startChallengeWatchers (config: GetChallengeWatchersConfig) {
  const watchers = getChallengeWatchers(config)
  watchers.forEach(async (watcher: Watcher) => await watcher.start())
  const stop = () => {
    return watchers.map(async (watcher: Watcher) => {
      return await watcher.stop()
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

export async function getWatcher (config: GetWatcherConfig) {
  const { chain, token, dryMode, watcherName } = config
  const watchers = await getWatchers({
    enabledWatchers: [watcherName!],
    tokens: [token],
    dryMode
  })

  const WatcherClass = WatcherClasses[watcherName!]
  const watcher = findWatcher(watchers, WatcherClass, chain) as typeof WatcherClass
  return watcher
}

export async function getBondTransferRootWatcher (config: GetWatcherConfig) {
  return getWatcher({ ...config, watcherName: Watchers.BondTransferRoot })
}

export async function getBondWithdrawalWatcher (config: GetWatcherConfig) {
  return getWatcher({ ...config, watcherName: Watchers.BondWithdrawal })
}

export async function getCommitTransfersWatcher (config: GetWatcherConfig) {
  return getWatcher({ ...config, watcherName: Watchers.CommitTransfers })
}

export async function getXDomainMessageRelayWatcher (config: GetWatcherConfig) {
  return getWatcher({ ...config, watcherName: Watchers.xDomainMessageRelay })
}

export async function getSettleBondedWithdrawalsWatcher (config: GetWatcherConfig) {
  return getWatcher({ ...config, watcherName: Watchers.SettleBondedWithdrawals })
}
