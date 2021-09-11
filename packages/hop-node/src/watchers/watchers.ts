import '../moduleAlias'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import SyncWatcher from 'src/watchers/SyncWatcher'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import xDomainMessageRelayWatcher from 'src/watchers/xDomainMessageRelayWatcher'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'

type Watcher = BondTransferRootWatcher | BondWithdrawalWatcher | ChallengeWatcher | CommitTransferWatcher | SettleBondedWithdrawalWatcher | StakeWatcher | SyncWatcher | xDomainMessageRelayWatcher

enum Watchers {
  BondWithdrawal = 'bondWithdrawal',
  BondTransferRoot = 'bondTransferRoot',
  SettleBondedWithdrawals = 'settleBondedWithdrawals',
  CommitTransfers = 'commitTransfers',
  xDomainMessageRelay = 'xDomainMessageRelay',
  Stake = 'stake'
}

type StakeAmounts = {
  [token: string]: number
}

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
  order?: number
  tokens?: string[]
  networks?: string[]
  bonder?: boolean
  challenger?: boolean
  maxStakeAmounts?: StakeAmounts
  commitTransfersMinThresholdAmounts?: CommitTransfersMinThresholdAmounts
  settleBondedWithdrawalsThresholdPercent?: SettleBondedWithdrawalsThresholdPercent
  dryMode?: boolean
  stateUpdateAddress?: string
  syncFromDate?: string
}

type GetStakeWatchersConfig = {
  tokens?: string[]
  networks?: string[]
  maxStakeAmounts?: StakeAmounts
  dryMode?: boolean
  stateUpdateAddress?: string,
}

type GetChallengeWatchersConfig = {
  tokens?: string[]
  networks?: string[]
  dryMode?: boolean
}

export function getWatchers (config: GetWatchersConfig) {
  const {
    enabledWatchers = [],
    order: orderNum = 0,
    tokens = getAllTokens(),
    networks = getAllChains(),
    bonder = true,
    challenger = false,
    maxStakeAmounts = {},
    commitTransfersMinThresholdAmounts = {},
    settleBondedWithdrawalsThresholdPercent = {},
    dryMode = false,
    stateUpdateAddress,
    syncFromDate
  } = config

  const order = () => orderNum
  const watchers : Watcher[] = []

  if (enabledWatchers.includes(Watchers.BondWithdrawal)) {
    watchers.push(...getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
      return new BondWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
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
        order,
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

      return new CommitTransferWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
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
      if (!isL1) {
        return
      }
      return new BondTransferRootWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
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

  if (enabledWatchers.includes(Watchers.Stake)) {
    watchers.push(
      ...getStakeWatchers({
        tokens,
        networks,
        maxStakeAmounts,
        dryMode,
        stateUpdateAddress
      })
    )
  }

  if (challenger) {
    watchers.push(...getChallengeWatchers({
      tokens,
      networks,
      dryMode
    }))
  }

  const syncWatchers = getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
    return new SyncWatcher({
      chainSlug: network,
      tokenSymbol: token,
      isL1,
      label,
      bridgeContract,
      syncFromDate
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

  return watchers
}

export function startWatchers (config: GetWatchersConfig) {
  const watchers = getWatchers(config)
  watchers.forEach((watcher: Watcher) => watcher.start())
  const stop = () => {
    return watchers.map((watcher: Watcher) => {
      return watcher.stop()
    })
  }

  return { stop, watchers }
}

export function startChallengeWatchers (config: GetChallengeWatchersConfig) {
  const watchers = getChallengeWatchers(config)
  watchers.forEach((watcher: Watcher) => watcher.start())
  const stop = () => {
    return watchers.map((watcher: Watcher) => {
      return watcher.stop()
    })
  }

  return { stop, watchers }
}

export function getStakeWatchers (config: GetStakeWatchersConfig) {
  const {
    tokens = getAllTokens(),
    networks = getAllChains(),
    maxStakeAmounts = {},
    dryMode = false,
    stateUpdateAddress
  } = config

  const watchers = getSiblingWatchers({ networks, tokens }, ({ isL1, label, network, token, bridgeContract, tokenContract }: any) => {
    return new StakeWatcher({
      isL1,
      chainSlug: network,
      tokenSymbol: token,
      label,
      bridgeContract,
      tokenContract,
      stakeMinThreshold: 0,
      maxStakeAmount: maxStakeAmounts[token],
      dryMode,
      stateUpdateAddress
    })
  })

  return watchers
}

export function getChallengeWatchers (config: GetChallengeWatchersConfig) {
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

function getSiblingWatchers (config: any, init: (conf: any) => Watcher) {
  const {
    tokens = getAllTokens(),
    networks = getAllChains()
  } = config
  const watchers: {[token: string]: {[chainId: string]: Watcher}} = {}
  const list: Watcher[] = []

  for (const token of tokens) {
    for (const network of networks) {
      const label = `${network}.${token}`
      const isL1 = network === Chain.Ethereum
      const chainId = chainSlugToId(network)
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

export function findWatcher (watchers: Watcher[], WatcherType: any, chain?: string, token? :string) {
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

function getAllChains () {
  return Object.keys(globalConfig.networks)
}

function getAllTokens () {
  return Object.keys(globalConfig.tokens)
}
