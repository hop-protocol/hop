import '../moduleAlias'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import SyncWatcher from 'src/watchers/SyncWatcher'
import contracts from 'src/contracts'
import xDomainMessageRelayWatcher from 'src/watchers/xDomainMessageRelayWatcher'
import { Chain } from 'src/constants'
import { chainSlugToId, getRpcProviderFromUrl } from 'src/utils'
import { config as globalConfig } from 'src/config'

// TODO: refactor this file

const networks: string[] = [
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.xDai,
  Chain.Polygon,
  Chain.Ethereum
]

interface StakeAmounts {
  [key: string]: number
}

function getStakeWatchers (
  _tokens?: string[],
  _networks: string[] = networks,
  maxStakeAmounts: StakeAmounts = {},
  dryMode: boolean = false,
  stateUpdateAddress: string = ''
) {
  if (!_tokens) {
    _tokens = Object.keys(globalConfig.tokens)
  }
  _networks = (_networks || networks).filter((x: string) =>
    networks.includes(x)
  )
  const stakeWatchers: any = {}
  const watchers: any[] = []
  for (const token of _tokens) {
    for (const network of _networks) {
      const chainId = chainSlugToId(network)
      const tokenContracts = contracts.get(token, network)
      if (!tokenContracts) {
        continue
      }
      let bridgeContract = tokenContracts.l2Bridge
      let tokenContract = tokenContracts.l2HopBridgeToken
      if (network === Chain.Ethereum) {
        bridgeContract = tokenContracts.l1Bridge
        tokenContract = tokenContracts.l1CanonicalToken
      }

      const stakeWatcher = new StakeWatcher({
        isL1: network === Chain.Ethereum,
        chainSlug: network,
        tokenSymbol: token,
        label: `${network}.${token}`,
        bridgeContract,
        tokenContract,
        stakeMinThreshold: 0,
        maxStakeAmount: maxStakeAmounts[token],
        dryMode,
        stateUpdateAddress
      })

      stakeWatchers[token] = stakeWatchers[token] || {}
      stakeWatchers[token][chainId] = stakeWatcher
      watchers.push(stakeWatcher)
    }
  }

  for (const token in stakeWatchers) {
    for (const network in stakeWatchers[token]) {
      stakeWatchers[token][network].setSiblingWatchers(stakeWatchers[token])
    }
  }

  watchers.forEach(watcher => {
    const readRpcUrl = globalConfig.networks[watcher.chainSlug].readRpcUrl
    if (readRpcUrl) {
      const provider = getRpcProviderFromUrl(
        readRpcUrl
      )
      watcher.logger.debug(`read rpc url: ${readRpcUrl}`)
      watcher.bridge.setReadProvider(provider)
    }

    const specialReadRpcUrl = globalConfig.networks[watcher.chainSlug].specialReadRpcUrl
    if (specialReadRpcUrl) {
      const provider = getRpcProviderFromUrl(
        specialReadRpcUrl
      )
      watcher.logger.debug(`special read rpc url: ${specialReadRpcUrl}`)
      watcher.bridge.setSpecialReadProvider(provider)
    }
  })

  return watchers
}

function startStakeWatchers (
  _tokens?: string[],
  _networks: string[] = networks,
  maxStakeAmounts: StakeAmounts = {},
  dryMode: boolean = false,
  stateUpdateAddress: string = '',
  start: boolean = true
) {
  const watchers = getStakeWatchers(
    _tokens,
    _networks,
    maxStakeAmounts,
    dryMode,
    stateUpdateAddress
  )
  if (start || start === undefined) {
    watchers.forEach(watcher => watcher.start())
  }
  return watchers
}

type Config = {
  enabledWatchers?: string[]
  order?: number
  tokens?: string[]
  networks?: string[]
  bonder?: boolean
  challenger?: boolean
  maxStakeAmounts?: StakeAmounts
  commitTransfersMinThresholdAmounts?: any
  bondWithdrawalAmounts?: any
  settleBondedWithdrawalsThresholdPercent?: any
  dryMode?: boolean
  stateUpdateAddress?: string
  start?: boolean
}

function startWatchers (
  _config: Config = {
    enabledWatchers: [],
    order: 0,
    tokens: Object.keys(globalConfig.tokens),
    networks: networks,
    bonder: true,
    challenger: false,
    maxStakeAmounts: {},
    commitTransfersMinThresholdAmounts: {},
    settleBondedWithdrawalsThresholdPercent: {},
    bondWithdrawalAmounts: {},
    dryMode: false,
    stateUpdateAddress: '',
    start: true
  }
) {
  const enabledWatchers = _config.enabledWatchers || []
  const orderNum = _config.order || 0
  let _tokens = _config.tokens
  let _networks = (_config.networks || []).filter(x => networks.includes(x))
  if (!_tokens || !_tokens.length) {
    _tokens = Object.keys(globalConfig.tokens)
  }
  if (!_networks.length) {
    _networks = networks
  }
  const dryMode = _config.dryMode
  const stateUpdateAddress = _config.stateUpdateAddress
  const watchers: any[] = []

  const order = () => {
    return orderNum
  }

  const bondWithdrawalWatchers: any = {}
  const bondTransferRootWatchers: any = {}
  const settleBondedWithdrawalWatchers: any = {}
  const commitTransferWatchers: any = {}
  const syncWatchers: any = {}
  for (const network of _networks) {
    const chainId = chainSlugToId(network)
    for (const token of _tokens) {
      if (!contracts.has(token, network)) {
        continue
      }
      const label = `${network}.${token}`
      const isL1 = network === Chain.Ethereum

      const bridgeContract = isL1
        ? contracts.get(token, Chain.Ethereum).l1Bridge
        : contracts.get(token, network).l2Bridge

      const bondWithdrawalWatcher = new BondWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
        label,
        isL1,
        bridgeContract,
        dryMode,
        stateUpdateAddress
      })

      bondWithdrawalWatchers[token] = bondWithdrawalWatchers[token] || {}
      bondWithdrawalWatchers[token][chainId] = bondWithdrawalWatcher
      if (enabledWatchers.includes('bondWithdrawal')) {
        watchers.push(bondWithdrawalWatcher)
      }

      const bondTransferRootWatcher = new BondTransferRootWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
        label,
        isL1,
        bridgeContract,
        dryMode,
        stateUpdateAddress
      })

      bondTransferRootWatchers[token] = bondTransferRootWatchers[token] || {}
      bondTransferRootWatchers[token][chainId] = bondTransferRootWatcher
      if (enabledWatchers.includes('bondTransferRoot')) {
        watchers.push(bondTransferRootWatcher)
      }

      const settleBondedWithdrawalWatcher = new SettleBondedWithdrawalWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
        label,
        isL1,
        bridgeContract,
        dryMode,
        minThresholdPercent:
          _config.settleBondedWithdrawalsThresholdPercent?.[token],
        stateUpdateAddress
      })

      settleBondedWithdrawalWatchers[token] =
        settleBondedWithdrawalWatchers[token] || {}
      settleBondedWithdrawalWatchers[token][
        chainId
      ] = settleBondedWithdrawalWatcher
      if (enabledWatchers.includes('settleBondedWithdrawals')) {
        watchers.push(settleBondedWithdrawalWatcher)
      }

      // note: the second option is for backward compatibility.
      // remove it once all bonders have updated to use chain specific config.
      const minThresholdAmount = _config.commitTransfersMinThresholdAmounts?.[network]?.[token] || _config.commitTransfersMinThresholdAmounts?.[token]

      const commitTransferWatcher = new CommitTransferWatcher({
        chainSlug: network,
        tokenSymbol: token,
        order,
        label,
        isL1,
        bridgeContract,
        minThresholdAmount,
        dryMode,
        stateUpdateAddress
      })

      commitTransferWatchers[token] = commitTransferWatchers[token] || {}
      commitTransferWatchers[token][chainId] = commitTransferWatcher

      if (enabledWatchers.includes('commitTransfers')) {
        watchers.push(commitTransferWatcher)
      }

      if (network !== Chain.Ethereum) {
        const l2ExitWatcher = new xDomainMessageRelayWatcher({
          chainSlug: network,
          tokenSymbol: token,
          isL1,
          label: `${network}.${token}`,
          token,
          bridgeContract,
          l1BridgeContract: contracts.get(token, Chain.Ethereum).l1Bridge,
          dryMode
        })

        if (enabledWatchers.includes('xDomainMessageRelay')) {
          watchers.push(l2ExitWatcher)
        }
      }

      const syncWatcher = new SyncWatcher({
        chainSlug: network,
        tokenSymbol: token,
        isL1,
        label: `${network}.${token}`,
        bridgeContract
      })

      syncWatchers[token] = syncWatchers[token] || {}
      syncWatchers[token][chainId] = syncWatcher
      watchers.push(syncWatcher)
    }
  }

  for (const token in syncWatchers) {
    for (const network in syncWatchers[token]) {
      syncWatchers[token][network].setSiblingWatchers(
        syncWatchers[token]
      )
    }
  }

  for (const token in bondTransferRootWatchers) {
    for (const network in bondTransferRootWatchers[token]) {
      bondTransferRootWatchers[token][network].setSiblingWatchers(
        bondTransferRootWatchers[token]
      )
    }
  }

  for (const token in bondWithdrawalWatchers) {
    for (const network in bondWithdrawalWatchers[token]) {
      bondWithdrawalWatchers[token][network].setSiblingWatchers(
        bondWithdrawalWatchers[token]
      )
    }
  }

  for (const token in commitTransferWatchers) {
    for (const network in commitTransferWatchers[token]) {
      commitTransferWatchers[token][network].setSiblingWatchers(
        commitTransferWatchers[token]
      )
    }
  }

  for (const token in settleBondedWithdrawalWatchers) {
    for (const network in settleBondedWithdrawalWatchers[token]) {
      settleBondedWithdrawalWatchers[token][network].setSiblingWatchers(
        settleBondedWithdrawalWatchers[token]
      )
    }
  }

  if (_config?.bonder || _config?.bonder === undefined) {
    watchers.forEach(watcher => {
      if (globalConfig.networks[watcher.chainSlug].readRpcUrl) {
        const provider = getRpcProviderFromUrl(
          globalConfig.networks[watcher.chainSlug].readRpcUrl
        )
        watcher.bridge.setReadProvider(provider)
      }
      if (_config.start || _config.start === undefined) {
        watcher.start()
      }
    })
    if (enabledWatchers.includes('stake')) {
      watchers.push(
        ...startStakeWatchers(
          _tokens,
          _networks,
          _config.maxStakeAmounts,
          dryMode,
          stateUpdateAddress,
          _config.start
        )
      )
    }
  }

  if (_config?.challenger) {
    watchers.push(...startChallengeWatchers(_tokens, _networks, dryMode))
  }

  for (const watcher of watchers) {
    watcher.setSyncWatcher(
      syncWatchers[watcher.bridge.tokenSymbol][watcher.bridge.chainId]
    )
  }

  const stop = () => {
    return watchers.map(watcher => {
      return watcher.stop()
    })
  }

  return { stop, watchers }
}

function startChallengeWatchers (
  _tokens?: string[],
  _networks?: string[],
  dryMode?: boolean
) {
  if (!_tokens) {
    _tokens = Object.keys(globalConfig.tokens)
  }
  if (!_networks) {
    _tokens = Object.keys(globalConfig.networks)
  }

  const watchers: any[] = []
  const challengeWatchers: any = {}
  for (const token of _tokens) {
    for (const network of _networks) {
      if (!contracts.has(token, network)) {
        continue
      }
      const isL1 = network === Chain.Ethereum
      const bridgeContract = isL1
        ? contracts.get(token, Chain.Ethereum).l1Bridge
        : contracts.get(token, network).l2Bridge
      const chainId = chainSlugToId(network)
      const challengeWatcher = new ChallengeWatcher({
        chainSlug: network,
        bridgeContract,
        tokenSymbol: token,
        isL1,
        label: `${network}.${token}`,
        dryMode: dryMode
      })
      challengeWatchers[token] = challengeWatchers[token] || {}
      challengeWatchers[token][chainId] = challengeWatcher
      watchers.push(challengeWatcher)
    }
    for (const network in challengeWatchers[token]) {
      challengeWatchers[token][network].setSiblingWatchers(
        challengeWatchers[token]
      )
    }
  }

  watchers.forEach(watcher => watcher.start())
  return watchers
}

function startCommitTransferWatchers () {
  const watchers: any[] = []
  const tokens = Object.keys(globalConfig.tokens)
  for (const network of networks) {
    for (const token of tokens) {
      /*
      watchers.push(
        new CommitTransferWatcher({
          chainSlug: network,
          label: network,
          l2BridgeContract: contracts.get[token][network].l2Bridge,
          // TODO
          contracts: {
            '1': contracts.get(token, ETHEREUM)?.l1Bridge,
            '42': contracts.get(token, ETHEREUM)?.l1Bridge,
            '5': contracts.get(token, ETHEREUM)?.l1Bridge,
            '69': contracts.get(token, OPTIMISM)?.l2Bridge,
            '79377087078960': contracts.get(token, ARBITRUM)?.l2Bridge,
            '77': contracts.get(token, XDAI)?.l2Bridge,
            '80001': contracts.get(token, POLYGON)?.l2Bridge
          }
        })
      )
      */
    }
  }
  watchers.forEach(watcher => watcher.start())
  return watchers
}

export {
  startWatchers,
  getStakeWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
}
