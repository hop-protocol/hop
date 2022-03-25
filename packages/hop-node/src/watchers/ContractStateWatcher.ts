import chainSlugToId from 'src/utils/chainSlugToId'
import l1BridgeAbi from '@hop-protocol/core/abi/generated/L1_Bridge.json'
import l2AmmWrapperAbi from '@hop-protocol/core/abi/generated/L2_AmmWrapper.json'
import l2BridgeAbi from '@hop-protocol/core/abi/generated/L2_Bridge.json'
import swapAbi from '@hop-protocol/core/abi/generated/Swap.json'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract } from 'ethers'
import { getConfigBondersForToken, getEnabledNetworks, config as globalConfig } from 'src/config'

type Config = {
  token: string
  contracts?: string[]
}

export enum Contracts {
  L1Bridge = 'L1Bridge',
  L2Bridge = 'L2Bridge',
  L2Amm = 'L2Amm',
  L2AmmWrapper = 'L2AmmWrapper'
}

class ContractStateWatcher {
  token: string
  contracts: string[] = [Contracts.L1Bridge, Contracts.L2Bridge, Contracts.L2Amm, Contracts.L2AmmWrapper]

  constructor (config: Config) {
    if (!config.token) {
      throw new Error('token is required')
    }
    this.token = config.token
    if (config.contracts?.length) {
      this.contracts = config.contracts
    }
  }

  async getL1BridgeState () {
    const l1Wallet = wallets.get(Chain.Ethereum)
    const address = globalConfig.addresses[this.token]?.ethereum?.l1Bridge
    if (!address) {
      return null
    }
    const l1Bridge = new Contract(address, l1BridgeAbi, l1Wallet)
    const challengeAmountDivisor = (await l1Bridge.CHALLENGE_AMOUNT_DIVISOR()).toString()
    const timeSlotSize = (await l1Bridge.TIME_SLOT_SIZE()).toString()
    const challengePeriod = (await l1Bridge.challengePeriod()).toString()
    const challengeResolutionPeriod = (await l1Bridge.challengeResolutionPeriod()).toString()
    const chainId = (await l1Bridge.getChainId()).toString()
    const governance = await l1Bridge.governance()
    const minTransferRootBondDelay = (await l1Bridge.minTransferRootBondDelay()).toString()

    const chains = getEnabledNetworks()
    const chainStates: any = {}
    for (const chain of chains) {
      if (chain === Chain.Ethereum) {
        continue
      }
      const chainId = chainSlugToId(chain)
      if (!chainStates[chainId]) {
        chainStates[chainId] = {}
      }
      const chainBalance = (await l1Bridge.chainBalance(chainId)).toString()
      const crossDomainMessengerWrapper = await l1Bridge.crossDomainMessengerWrappers(chainId)
      const isChainIdPaused = await l1Bridge.isChainIdPaused(chainId)
      const timeSlot = (await l1Bridge.getTimeSlot(chainId)).toString()

      chainStates[chainId] = {
        chainBalance,
        crossDomainMessengerWrapper,
        isChainIdPaused,
        timeSlot
      }
    }

    const bonderStates: any = await this.getBonderStates(l1Bridge)

    return {
      challengeAmountDivisor,
      timeSlotSize,
      challengePeriod,
      challengeResolutionPeriod,
      chainId,
      governance,
      minTransferRootBondDelay,
      chainStates,
      bonderStates
    }
  }

  private async getBonderStates (bridge: any) {
    const bonderStates: any = {}
    const bonders = new Set<string>()
    const tokenBonderRoutes = getConfigBondersForToken(this.token)
    for (const sourceChain in tokenBonderRoutes) {
      for (const destinationChain in tokenBonderRoutes?.[sourceChain]) {
        const bonder = tokenBonderRoutes?.[sourceChain]?.[destinationChain]
        bonders.add(bonder)
      }
    }
    for (const bonder of bonders) {
      if (!bonderStates[bonder]) {
        bonderStates[bonder] = {}
      }

      const credit = (await bridge.getCredit(bonder)).toString()
      const debitAndAdditionalDebit = (await bridge.getDebitAndAdditionalDebit(bonder)).toString()
      const isBonder = (await bridge.getIsBonder(bonder)).toString()
      const rawDebit = (await bridge.getRawDebit(bonder)).toString()

      bonderStates[bonder] = {
        credit,
        debitAndAdditionalDebit,
        isBonder
      }
    }

    return bonderStates
  }

  async getL2BridgeState (chain: string) {
    const l2Wallet = wallets.get(chain)
    const address = globalConfig.addresses[this.token]?.[chain]?.l2Bridge
    if (!address) {
      return null
    }
    const l2Bridge = new Contract(address, l2BridgeAbi, l2Wallet)
    const ammWrapper = await l2Bridge.ammWrapper()
    const chainId = (await l2Bridge.getChainId()).toString()
    const nextTransferNonce = await l2Bridge.getNextTransferNonce()
    const hToken = await l2Bridge.hToken()
    const l1BridgeAddress = await l2Bridge.l1BridgeAddress()
    const l1BridgeCaller = await l2Bridge.l1BridgeCaller()
    const l1Governance = await l2Bridge.l1Governance()
    const maxPendingTransfers = (await l2Bridge.maxPendingTransfers()).toString()
    const minBonderBps = (await l2Bridge.minBonderBps()).toString()
    const minBonderFeeAbsolute = (await l2Bridge.minBonderFeeAbsolute()).toString()

    const chains = getEnabledNetworks()
    const chainStates: any = {}
    for (const chain of chains) {
      const chainId = chainSlugToId(chain)
      if (!chainStates[chainId]) {
        chainStates[chainId] = {}
      }
      const activeChainId = await l2Bridge.activeChainIds(chainId)
      const lastCommitTimeForChainId = (await l2Bridge.lastCommitTimeForChainId(chainId)).toString()
      const pendingAmountForChainId = (await l2Bridge.pendingAmountForChainId(chainId)).toString()

      chainStates[chainId] = {
        activeChainId,
        lastCommitTimeForChainId,
        pendingAmountForChainId
      }
    }

    const bonderStates: any = await this.getBonderStates(l2Bridge)

    return {
      ammWrapper,
      chainId,
      nextTransferNonce,
      hToken,
      l1BridgeAddress,
      l1BridgeCaller,
      l1Governance,
      maxPendingTransfers,
      minBonderBps,
      minBonderFeeAbsolute,
      chainStates,
      bonderStates
    }
  }

  async getL2BridgeStates () {
    const chains = getEnabledNetworks()
    const states: any = {}
    for (const chain of chains) {
      if (chain === Chain.Ethereum) {
        continue
      }
      const l2Bridge = await this.getL2BridgeState(chain)
      states[chain] = l2Bridge
    }
    return states
  }

  async getL2AmmState (chain: string) {
    const l2Wallet = wallets.get(chain)
    const address = globalConfig.addresses[this.token]?.[chain]?.l2SaddleSwap
    if (!address) {
      return null
    }
    const l2Amm = new Contract(address, swapAbi, l2Wallet)
    const A = (await l2Amm.getA()).toString()
    const APrecise = (await l2Amm.getAPrecise()).toString()
    const token0 = await l2Amm.getToken(0)
    const token1 = await l2Amm.getToken(1)
    const token0Balance = (await l2Amm.getTokenBalance(0)).toString()
    const token1Balance = (await l2Amm.getTokenBalance(1)).toString()
    const virtualPrice = (await l2Amm.getVirtualPrice()).toString()
    const _swapStorage = await l2Amm.swapStorage()
    const swapStorage = {
      initialA: _swapStorage.initialA.toString(),
      futureA: _swapStorage.futureA.toString(),
      initialATime: _swapStorage.initialATime.toString(),
      futureATime: _swapStorage.futureATime.toString(),
      swapFee: _swapStorage.swapFee.toString(),
      adminFee: _swapStorage.adminFee.toString(),
      defaultWithdrawFee: _swapStorage.defaultWithdrawFee.toString(),
      lpToken: _swapStorage.lpToken
    }

    return {
      A,
      APrecise,
      token0,
      token1,
      token0Balance,
      token1Balance,
      virtualPrice,
      swapStorage
    }
  }

  async getL2AmmStates () {
    const chains = getEnabledNetworks()
    const states: any = {}
    for (const chain of chains) {
      if (chain === Chain.Ethereum) {
        continue
      }
      const l2Bridge = await this.getL2AmmState(chain)
      states[chain] = l2Bridge
    }
    return states
  }

  async getL2AmmWrapperState (chain: string) {
    const l2Wallet = wallets.get(chain)
    const address = globalConfig.addresses[this.token]?.[chain]?.l2AmmWrapper
    if (!address) {
      return null
    }
    const l2AmmWrapper = new Contract(address, l2AmmWrapperAbi, l2Wallet)
    const bridge = await l2AmmWrapper.bridge()
    const exchangeAddress = await l2AmmWrapper.exchangeAddress()
    const hToken = await l2AmmWrapper.hToken()
    const l2CanonicalToken = await l2AmmWrapper.l2CanonicalToken()
    const l2CanonicalTokenIsEth = await l2AmmWrapper.l2CanonicalTokenIsEth()

    return {
      bridge,
      exchangeAddress,
      l2CanonicalToken,
      l2CanonicalTokenIsEth
    }
  }

  async getL2AmmWrapperStates () {
    const chains = getEnabledNetworks()
    const states: any = {}
    for (const chain of chains) {
      if (chain === Chain.Ethereum) {
        continue
      }
      const l2Bridge = await this.getL2AmmWrapperState(chain)
      states[chain] = l2Bridge
    }
    return states
  }

  async getState () {
    const states: any = {}
    if (this.contracts.includes(Contracts.L1Bridge)) {
      states.l1Bridge = await this.getL1BridgeState()
    }
    if (this.contracts.includes(Contracts.L2Bridge)) {
      states.l2Bridges = await this.getL2BridgeStates()
    }
    if (this.contracts.includes(Contracts.L2Amm)) {
      states.l2Amms = await this.getL2AmmStates()
    }
    if (this.contracts.includes(Contracts.L2AmmWrapper)) {
      states.l2AmmWrappers = await this.getL2AmmWrapperStates()
    }

    return states
  }
}

export default ContractStateWatcher
