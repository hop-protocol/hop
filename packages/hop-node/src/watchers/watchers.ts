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
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
      return new BondWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        bridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.SettleBondedWithdrawals)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
      return new SettleBondedWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        bridgeContract,
        dryMode,
        minThresholdPercent: settleBondedWithdrawalsThresholdPercent?.[token]
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.CommitTransfers)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
      const minThresholdAmounts = commitTransfersMinThresholdAmounts?.[token]?.[network]

      return new CommitTransfersWatcher({
        chainSlug: network,
        tokenSymbol: token,
        bridgeContract,
        minThresholdAmounts,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.BondTransferRoot)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
      return new BondTransferRootWatcher({
        chainSlug: network,
        tokenSymbol: token,
        bridgeContract,
        dryMode
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.xDomainMessageRelay)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, network, token, bridgeContract, tokenContract }: any) => {
      if (isL1) {
        return
      }
      const l1BridgeContract = contracts.get(token, Chain.Ethereum)?.l1Bridge
      if (!l1BridgeContract) {
        return
      }
      return new xDomainMessageRelayWatcher({
        chainSlug: network,
        tokenSymbol: token,
        token,
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

  const syncWatchers = getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
    const gasCostPollEnabled = enabledWatchers.includes(Watchers.BondWithdrawal)

    return new SyncWatcher({
      chainSlug: network,
      tokenSymbol: token,
      bridgeContract,
      syncFromDate,
      gasCostPollEnabled
    })
  })

  watchers.push(...syncWatchers)

  for (const watcher of watchers) {
    watcher.setSyncWatcher(
      findWatcher(
        syncWatchers,
        SyncWatcher,
        watcher.bridge.chainSlug,
        watcher.bridge.tokenSymbol
      ) as SyncWatcher
    )
  }

  const availableLiquidityWatchers = getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
    return new AvailableLiquidityWatcher({
      chainSlug: network,
      tokenSymbol: token,
      bridgeContract,
      s3Upload,
      s3Namespace
    })
  })

  watchers.push(...availableLiquidityWatchers)

  for (const watcher of watchers) {
    watcher.setAvailableLiquidityWatcher(
      findWatcher(
        availableLiquidityWatchers,
        AvailableLiquidityWatcher,
        watcher.bridge.chainSlug,
        watcher.bridge.tokenSymbol
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

  const watchers = getSiblingWatchers({ networks, tokens }, ({ network, token, bridgeContract, tokenContract }: any) => {
    return new ChallengeWatcher({
      chainSlug: network,
      bridgeContract,
      tokenSymbol: token,
      dryMode
    })
  })

  return watchers
}

function getSiblingWatchers (config: any, init: (conf: any) => Watcher | undefined) {
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

  for (const token of tokens) {
    for (const network of networks) {
      const isL1 = network === Chain.Ethereum
      const chainId = chainSlugToId(network)! // eslint-disable-line
      if (!contracts.has(token, network)) {
        continue
      }

      const tokenContracts = contracts.get(token, network)
      let bridgeContract = tokenContracts.l2Bridge
      let tokenContract = tokenContracts.l2HopBridgeToken
      if (isL1) {
        bridgeContract = tokenContracts.l1Bridge
        tokenContract = tokenContracts.l1CanonicalToken
      }

      const watcher = init({
        network,
        token,
        bridgeContract,
        tokenContract,
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

      watchers[token] = watchers[token] || {}
      watchers[token][chainId] = watcher
      list.push(watcher)
    }
  }

  for (const token in watchers) {
    for (const network in watchers[token]) {
      watchers[token][network].setSiblingWatchers(watchers[token])
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
