import '../moduleAlias'
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

type Watcher = BondTransferRootWatcher | BondWithdrawalWatcher | ChallengeWatcher | CommitTransfersWatcher | SettleBondedWithdrawalWatcher | SyncWatcher | xDomainMessageRelayWatcher

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
  stateUpdateAddress?: string
  syncFromDate?: string
  s3Upload?: boolean
  s3Namespace?: string
}

type GetChallengeWatchersConfig = {
  tokens?: string[]
  networks?: string[]
  dryMode?: boolean
}

export async function getWatchers (config: GetWatchersConfig) {
  const {
    enabledWatchers = [],
    tokens = getAllTokens(),
    networks = getAllChains(),
    commitTransfersMinThresholdAmounts = {},
    settleBondedWithdrawalsThresholdPercent = {},
    dryMode = false,
    stateUpdateAddress,
    syncFromDate,
    s3Upload,
    s3Namespace
  } = config

  const watchers: Watcher[] = []
  logger.debug(`enabled watchers: ${enabledWatchers.join(',')}`)

  if (enabledWatchers.includes(Watchers.BondWithdrawal)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
      return new BondWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        label,
        isL1,
        bridgeContract,
        dryMode,
        stateUpdateAddress
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.SettleBondedWithdrawals)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
      return new SettleBondedWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        label,
        isL1,
        bridgeContract,
        dryMode,
        minThresholdPercent: settleBondedWithdrawalsThresholdPercent?.[token],
        stateUpdateAddress
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.CommitTransfers)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
      const minThresholdAmounts = commitTransfersMinThresholdAmounts?.[token]?.[network]

      return new CommitTransfersWatcher({
        chainSlug: network,
        tokenSymbol: token,
        label,
        isL1,
        bridgeContract,
        minThresholdAmounts,
        dryMode,
        stateUpdateAddress
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.BondTransferRoot)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
      return new BondTransferRootWatcher({
        chainSlug: network,
        tokenSymbol: token,
        label,
        isL1,
        bridgeContract,
        dryMode,
        stateUpdateAddress
      })
    }))
  }

  if (enabledWatchers.includes(Watchers.xDomainMessageRelay)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
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
        isL1,
        label,
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

  const syncWatchers = getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
    const gasCostPollEnabled = enabledWatchers.includes(Watchers.BondWithdrawal)

    return new SyncWatcher({
      chainSlug: network,
      tokenSymbol: token,
      isL1,
      label,
      bridgeContract,
      syncFromDate,
      s3Upload,
      s3Namespace,
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

  const watchers = getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
    return new ChallengeWatcher({
      chainSlug: network,
      bridgeContract,
      tokenSymbol: token,
      isL1,
      label,
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
      const label = `${network}.${token}`
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
        isL1,
        label
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
