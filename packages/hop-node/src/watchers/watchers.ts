import '../moduleAlias'
import { config, hostname as configHostname } from 'src/config'
import { Chain } from 'src/constants'
import contracts from 'src/contracts'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import xDomainMessageRelayWatcher from 'src/watchers/xDomainMessageRelayWatcher'
import Logger from 'src/logger'
import { networkSlugToId } from 'src/utils'

const networks: string[] = [
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.xDai,
  Chain.Polygon
]

interface StakeAmounts {
  [key: string]: number
}

function getStakeWatchers (
  _tokens?: string[],
  _networks: string[] = networks,
  maxStakeAmounts: StakeAmounts = {},
  dryMode: boolean = false
) {
  if (!_tokens) {
    _tokens = Object.keys(config.tokens)
  }
  _networks = (_networks || networks).filter((x: string) =>
    networks.includes(x)
  )
  let stakeWatchers: any = {}
  const watchers: any[] = []
  for (let token of _tokens) {
    for (let network of [Chain.Ethereum as string].concat(_networks)) {
      const networkId = networkSlugToId(network)
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
        label: `${network}.${token}`,
        bridgeContract,
        tokenContract,
        stakeMinThreshold: 0,
        maxStakeAmount: maxStakeAmounts[token],
        dryMode
      })

      stakeWatchers[token] = stakeWatchers[token] || {}
      stakeWatchers[token][networkId] = stakeWatcher
      watchers.push(stakeWatcher)
    }
  }

  for (let token in stakeWatchers) {
    for (let network in stakeWatchers[token]) {
      stakeWatchers[token][network].setSiblingWatchers(stakeWatchers[token])
    }
  }

  return watchers
}

function startStakeWatchers (
  _tokens?: string[],
  _networks: string[] = networks,
  maxStakeAmounts: StakeAmounts = {},
  dryMode: boolean = false
) {
  const watchers = getStakeWatchers(
    _tokens,
    _networks,
    maxStakeAmounts,
    dryMode
  )
  watchers.forEach(watcher => watcher.start())
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
}

function startWatchers (
  _config: Config = {
    enabledWatchers: [],
    order: 0,
    tokens: Object.keys(config.tokens),
    networks: networks,
    bonder: true,
    challenger: false,
    maxStakeAmounts: {},
    commitTransfersMinThresholdAmounts: {},
    settleBondedWithdrawalsThresholdPercent: {},
    bondWithdrawalAmounts: {},
    dryMode: false
  }
) {
  const enabledWatchers = _config.enabledWatchers || []
  const orderNum = _config.order || 0
  let _tokens = _config.tokens
  let _networks = _config.networks.filter(x => networks.includes(x))
  if (!_tokens || !_tokens.length) {
    _tokens = Object.keys(config.tokens)
  }
  if (!_networks.length) {
    _networks = networks
  }
  const dryMode = _config.dryMode
  const watchers: any[] = []

  const order = () => {
    return orderNum
  }

  let bondWithdrawalWatchers: any = {}
  let bondTransferRootWatchers: any = {}
  let settleBondedWithdrawalWatchers: any = {}
  let commitTransferWatchers: any = {}
  for (let network of [Chain.Ethereum as string].concat(_networks)) {
    const networkId = networkSlugToId(network)
    for (let token of _tokens) {
      if (!contracts.has(token, network)) {
        continue
      }
      const label = `${network}.${token}`
      const isL1 = network === Chain.Ethereum

      const bridgeContract = isL1
        ? contracts.get(token, Chain.Ethereum).l1Bridge
        : contracts.get(token, network).l2Bridge

      const bondWithdrawalWatcher = new BondWithdrawalWatcher({
        order,
        label,
        isL1,
        bridgeContract,
        dryMode,
        minAmount: _config?.bondWithdrawalAmounts?.[token]?.min,
        maxAmount: _config?.bondWithdrawalAmounts?.[token]?.max
      })

      bondWithdrawalWatchers[token] = bondWithdrawalWatchers[token] || {}
      bondWithdrawalWatchers[token][networkId] = bondWithdrawalWatcher
      if (enabledWatchers.includes('bondWithdrawal')) {
        watchers.push(bondWithdrawalWatcher)
      }

      const bondTransferRootWatcher = new BondTransferRootWatcher({
        order,
        label,
        isL1,
        bridgeContract,
        dryMode
      })

      bondTransferRootWatchers[token] = bondTransferRootWatchers[token] || {}
      bondTransferRootWatchers[token][networkId] = bondTransferRootWatcher
      if (enabledWatchers.includes('bondTransferRoot')) {
        watchers.push(bondTransferRootWatcher)
      }

      const settleBondedWithdrawalWatcher = new SettleBondedWithdrawalWatcher({
        order,
        label,
        isL1,
        bridgeContract,
        dryMode,
        minThresholdPercent:
          _config.settleBondedWithdrawalsThresholdPercent?.[token]
      })

      settleBondedWithdrawalWatchers[token] =
        settleBondedWithdrawalWatchers[token] || {}
      settleBondedWithdrawalWatchers[token][
        networkId
      ] = settleBondedWithdrawalWatcher
      if (enabledWatchers.includes('settleBondedWithdrawals')) {
        watchers.push(settleBondedWithdrawalWatcher)
      }

      const commitTransferWatcher = new CommitTransferWatcher({
        order,
        label,
        isL1,
        bridgeContract,
        minThresholdAmount: _config.commitTransfersMinThresholdAmounts?.[token],
        dryMode
      })

      commitTransferWatchers[token] = commitTransferWatchers[token] || {}
      commitTransferWatchers[token][networkId] = commitTransferWatcher

      if (enabledWatchers.includes('commitTransfers')) {
        watchers.push(commitTransferWatcher)
      }

      if (network !== Chain.Ethereum) {
        const l2ExitWatcher = new xDomainMessageRelayWatcher({
          isL1: false,
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
    }
  }

  for (let token in bondWithdrawalWatchers) {
    for (let network in bondWithdrawalWatchers[token]) {
      bondWithdrawalWatchers[token][network].setSiblingWatchers(
        bondWithdrawalWatchers[token]
      )
    }
  }

  for (let token in bondTransferRootWatchers) {
    for (let network in bondTransferRootWatchers[token]) {
      bondTransferRootWatchers[token][network].setSiblingWatchers(
        bondTransferRootWatchers[token]
      )
    }
  }

  for (let token in settleBondedWithdrawalWatchers) {
    for (let network in settleBondedWithdrawalWatchers[token]) {
      settleBondedWithdrawalWatchers[token][network].setSiblingWatchers(
        settleBondedWithdrawalWatchers[token]
      )
    }
  }

  for (let token in commitTransferWatchers) {
    for (let network in commitTransferWatchers[token]) {
      commitTransferWatchers[token][network].setSiblingWatchers(
        commitTransferWatchers[token]
      )
    }
  }

  if (_config?.bonder || _config?.bonder === undefined) {
    watchers.forEach(watcher => watcher.start())
    if (enabledWatchers.includes('stake')) {
      watchers.push(
        ...startStakeWatchers(
          _tokens,
          _networks,
          _config.maxStakeAmounts,
          dryMode
        )
      )
    }
  }

  if (_config?.challenger) {
    watchers.push(...startChallengeWatchers(_tokens, _networks))
  }

  const stop = () => {
    return watchers.map(watcher => {
      return watcher.stop()
    })
  }

  return { stop, watchers }
}

function startChallengeWatchers (_tokens?: string[], _networks?: string[]) {
  if (!_tokens) {
    _tokens = Object.keys(config.tokens)
  }
  if (!_networks) {
    _tokens = Object.keys(config.networks)
  }

  const watchers: any[] = []
  for (let network of _networks) {
    for (let token of _tokens) {
      if (!contracts.has(token, network)) {
        continue
      }
      /*
      watchers.push(
        new ChallengeWatcher({
          label: network,
          l1BridgeContract: contracts.get(token, ETHEREUM).l1Bridge,
          l2BridgeContract: contracts.get(token, network).l2Bridge,
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

function startCommitTransferWatchers () {
  const watchers: any[] = []
  const tokens = Object.keys(config.tokens)
  for (let network of networks) {
    for (let token of tokens) {
      /*
      watchers.push(
        new CommitTransferWatcher({
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
