// @ts-ignore
import { Watcher } from '@eth-optimism/watcher'
import expect from 'expect'
import { ethers, providers, Contract, Wallet } from 'ethers'
import { HDNode } from '@ethersproject/hdnode'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { config } from 'src/config'
import {
  l1BridgeAbi,
  l2BridgeAbi,
  erc20Abi,
  l2AmmWrapperAbi,
  saddleSwapAbi,
  arbitrumGlobalInboxAbi,
  l1xDaiForeignOmniBridgeAbi,
  l1xDaiMessengerAbi,
  l1OptimismMessengerAbi,
  l1ArbitrumMessengerAbi,
  l1PolygonMessengerAbi,
  l1xDaiMessengerWrapperAbi,
  l1OptimismMessengerWrapperAbi,
  l1ArbitrumMessengerWrapperAbi,
  l1PolygonMessengerWrapperAbi,
  l1OptimismTokenBridgeAbi,
  l1PolygonPosRootChainManagerAbi,
  l2PolygonChildErc20Abi
} from '@hop-protocol/abi'
import { privateKey } from './config'
import {
  UINT256,
  ZERO_ADDRESS,
  ETHEREUM,
  ARBITRUM,
  OPTIMISM,
  POLYGON,
  XDAI,
  DAI
} from 'src/constants'
import { wait, getRpcUrl, networkSlugToId } from 'src/utils'
import queue from 'src/watchers/helpers/queue'

export class User {
  privateKey: string

  constructor (privateKey: string) {
    this.privateKey = privateKey
  }

  get queueGroup () {
    return this.privateKey
  }

  getProvider (network: string) {
    const url = getRpcUrl(network)
    return new providers.StaticJsonRpcProvider(url)
  }

  getWallet (network: string = ETHEREUM) {
    const provider = this.getProvider(network)
    return new Wallet(this.privateKey, provider)
  }

  async getBalance (network: string = ETHEREUM, token: string | Contract = '') {
    const address = await this.getAddress()
    if (!token) {
      const provider = this.getProvider(network)
      const balance = await provider.getBalance(address)
      return Number(formatUnits(balance, 18))
    }
    let contract: Contract
    if (typeof token === 'string') {
      contract = this.getTokenContract(network, token)
    } else {
      contract = token
    }
    const bal = await contract.balanceOf(address)
    return Number(formatUnits(bal.toString(), 18))
  }

  async getHopBalance (network: string = ETHEREUM, token: string = '') {
    const contract = this.getHopBridgeTokenContract(network, token)
    return this.getBalance(network, contract)
  }

  getTokenContract (network: string, token: string) {
    let tokenAddress = config.tokens[token][network].l2CanonicalToken
    if (network === ETHEREUM) {
      tokenAddress = config.tokens[token][network].l1CanonicalToken
    }
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Abi, wallet)
  }

  getSaddleSwapContract (network: string, token: string) {
    let saddleSwapAddress = config.tokens[token][network].l2SaddleSwap
    const wallet = this.getWallet(network)
    return new Contract(saddleSwapAddress, saddleSwapAbi, wallet)
  }

  async mint (
    network: string,
    token: string,
    amount: string | number,
    recipient?: string
  ) {
    const contract = this.getTokenContract(network, token)
    if (!recipient) {
      recipient = await this.getAddress()
    }
    return contract.mint(recipient, parseUnits(amount.toString(), 18))
  }

  @queue
  async transfer (
    network: string,
    token: string,
    amount: string | number,
    recipient: string
  ) {
    const contract = this.getTokenContract(network, token)
    return contract.transfer(recipient, parseUnits(amount.toString(), 18))
  }

  getHopBridgeContract (network: string, token: string = DAI) {
    let bridgeAddress: string
    let artifact: any
    if (network === ETHEREUM) {
      bridgeAddress = config.tokens[token][network].l1Bridge
      artifact = l1BridgeAbi
    } else {
      bridgeAddress = config.tokens[token][network].l2Bridge
      artifact = l2BridgeAbi
    }

    const wallet = this.getWallet(network)
    return new Contract(bridgeAddress, artifact, wallet)
  }

  getHopBridgeTokenContract (network: string, token: string) {
    let tokenAddress = config.tokens[token][network].l2HopBridgeToken
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Abi, wallet)
  }

  async getMessengerWrapperContract (network: string, token: string = DAI) {
    const bridge = this.getHopBridgeContract(ETHEREUM, token)
    const chainId = networkSlugToId(network)
    const wrapperAddress = await bridge.crossDomainMessengerWrappers(chainId)
    const wallet = this.getWallet(ETHEREUM)
    let abi: any
    if (network === ARBITRUM) {
      abi = l1ArbitrumMessengerWrapperAbi
    } else if (network === OPTIMISM) {
      abi = l1OptimismMessengerWrapperAbi
    } else if (network === XDAI) {
      abi = l1xDaiMessengerWrapperAbi
    } else if (network === POLYGON) {
      abi = l1PolygonMessengerWrapperAbi
    }
    return new Contract(wrapperAddress, abi, wallet)
  }

  async getMessengerContract (network: string, token: string = DAI) {
    if (network === ETHEREUM) {
      throw new Error('not supporsed')
    }
    const wrapper = await this.getMessengerWrapperContract(network, token)
    const wallet = this.getWallet(ETHEREUM)
    let messengerAddress: string
    let abi: any
    if (network === ARBITRUM) {
      messengerAddress = await wrapper.arbInbox()
      abi = l1ArbitrumMessengerAbi
    } else if (network === OPTIMISM) {
      messengerAddress = await wrapper.l1MessengerAddress()
      abi = l1OptimismMessengerAbi
    } else if (network === XDAI) {
      messengerAddress = await wrapper.l1MessengerAddress()
      abi = l1xDaiMessengerAbi
    } else if (network === POLYGON) {
      messengerAddress = await wrapper.address
      abi = l1PolygonMessengerAbi
    }
    return new Contract(messengerAddress, abi, wallet)
  }

  getAmmWrapperContract (network: string, token: string = DAI) {
    const wrapperAddress = config.tokens[token][network].l2AmmWrapper
    const wallet = this.getWallet(network)
    return new Contract(wrapperAddress, l2AmmWrapperAbi, wallet)
  }

  @queue
  async approve (
    network: string,
    token: string | Contract,
    spender: string,
    amount?: string | number
  ) {
    let contract: Contract
    if (typeof token === 'string') {
      contract = this.getTokenContract(network, token)
    } else {
      contract = token
    }
    let approveAmount = UINT256
    if (amount) {
      approveAmount = parseUnits(amount.toString(), 18).toString()
    }
    return contract.approve(spender, approveAmount, this.txOverrides(network))
  }

  async getAllowance (
    network: string,
    token: string | Contract,
    spender: string
  ) {
    const address = await this.getAddress()
    let contract: Contract
    if (typeof token === 'string') {
      contract = this.getTokenContract(network, token)
    } else {
      contract = token
    }
    const allowance = await contract.allowance(address, spender)
    return Number(formatUnits(allowance, 18))
  }

  async getAddress () {
    const wallet = this.getWallet()
    return wallet.getAddress()
  }

  async getTransactionReceipt (network: string, txHash: string) {
    const provider = this.getProvider(network)
    return provider.getTransactionReceipt(txHash)
  }

  async waitForTransactionReceipt (network: string, txHash: string) {
    const provider = this.getProvider(network)
    return provider.waitForTransaction(txHash)
  }

  async send (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    if (sourceNetwork === ETHEREUM) {
      return this.sendL1ToL2(sourceNetwork, destNetwork, token, amount)
    }
    if (destNetwork === ETHEREUM) {
      return this.sendL2ToL1(sourceNetwork, destNetwork, token, amount)
    }

    return this.sendL2ToL2(sourceNetwork, destNetwork, token, amount)
  }

  async sendL1ToL2 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const deadline = (Date.now() / 1000 + 300) | 0
    const amountOutMin = '0'
    const chainId = networkSlugToId(destNetwork)
    const recipient = await this.getAddress()
    const relayer = ethers.constants.AddressZero
    const relayerFee = '0'
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const ethBalance = await this.getBalance()
    if (ethBalance < 0.0001) {
      throw new Error('Not enough ETH balance for transfer')
    }

    const parsedAmount = parseUnits(amount.toString(), 18)
    const tx = bridge.sendToL2(
      chainId,
      recipient,
      parsedAmount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      this.txOverrides(sourceNetwork)
    )

    return tx
  }

  async sendL2ToL1 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const deadline = (Date.now() / 1000 + 300) | 0
    const chainId = networkSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const recipient = await this.getAddress()
    let destinationAmountOutMin = '0'
    let destinationDeadline = deadline
    let parsedAmount = parseUnits(amount.toString(), 18)

    if (destNetwork === ETHEREUM) {
      destinationAmountOutMin = '0'
      destinationDeadline = 0
    }

    const wrapper = this.getAmmWrapperContract(sourceNetwork, token)
    await this.checkApproval(sourceNetwork, token, wrapper.address)
    return wrapper.swapAndSend(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline
    )
  }

  async sendL2ToL2 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const recipient = await this.getAddress()
    const deadline = (Date.now() / 1000 + 300) | 0
    const sourceChainId = networkSlugToId(sourceNetwork)
    const chainId = networkSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const destinationAmountOutMin = '0'
    const destinationDeadline = (Date.now() / 1000 + 300) | 0
    const parsedAmount = parseUnits(amount.toString(), 18)

    await this.validateChainId(sourceChainId)
    const wrapper = this.getAmmWrapperContract(sourceNetwork, token)
    await this.checkApproval(sourceNetwork, token, wrapper.address)

    return wrapper.swapAndSend(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      this.txOverrides(sourceNetwork)
    )
  }

  async bridgeSend (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: number
  ) {
    const recipient = await this.getAddress()
    const deadline = (Date.now() / 1000 + 300) | 0
    const chainId = networkSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const parsedAmount = parseUnits(amount.toString(), 18)
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    return bridge.send(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      this.txOverrides(sourceNetwork)
    )
  }

  async swapAndSend (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: number
  ) {
    const recipient = await this.getAddress()
    const deadline = (Date.now() / 1000 + 300) | 0
    const destinationDeadline = deadline
    const destinationAmountOutMin = 0
    const chainId = networkSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const parsedAmount = parseUnits(amount.toString(), 18)
    const wrapper = this.getAmmWrapperContract(sourceNetwork, token)
    await this.checkApproval(sourceNetwork, token, wrapper.address)

    return wrapper.swapAndSend(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      this.txOverrides(sourceNetwork)
    )
  }

  async sendAndWaitForReceipt (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const tx = await this.send(sourceNetwork, destNetwork, token, amount)
    return this.waitForTransactionReceipt(sourceNetwork, tx.hash)
  }

  @queue
  async sendEth (amount: number | string, recipient: string, network?: string) {
    const wallet = this.getWallet(network)
    return wallet.sendTransaction({
      ...this.txOverrides(network),
      to: recipient,
      value: parseUnits(amount.toString(), 18)
    })
  }

  async sendTokens (
    network: string,
    token: string,
    amount: number | string,
    recipient: string
  ) {
    const tokenContract = this.getTokenContract(network, token)
    return tokenContract.transfer(
      recipient,
      parseUnits(amount.toString(), 18),
      this.txOverrides(network)
    )
  }

  async checkApproval (network: string, token: string, spender: string) {
    return checkApproval(this, network, token, spender)
  }

  @queue
  async stake (network: string, token: string, amount: number) {
    const parsedAmount = parseUnits(amount.toString(), 18)
    const bonder = await this.getAddress()
    const bridge = this.getHopBridgeContract(network, token)
    return bridge.stake(bonder, parsedAmount, this.txOverrides(network))
  }

  async getBonderFee (network: string, token: string, amount: string) {
    const bridge = this.getHopBridgeContract(network, token)
    const minBonderBps = await bridge.minBonderBps()
    const minBonderFeeAbsolute = await bridge.minBonderFeeAbsolute()
    const minBonderFeeRelative = parseUnits(amount, 18)
      .mul(minBonderBps)
      .div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

  getBridgeAddress (network: string, token: string) {
    let address = config.tokens[token][network].l2Bridge
    if (network === ETHEREUM) {
      address = config.tokens[token][network].l1Bridge
    }
    return address
  }

  getAmmWrapperAddress (network: string, token: string) {
    return config.tokens[token][network].l2AmmWrapper
  }

  async getLpToken (network: string, token: string) {
    const saddleSwap = this.getSaddleSwapContract(network, token)
    const swapStorage = await saddleSwap.swapStorage()
    const { lpToken: lpTokenAddress } = swapStorage
    const wallet = this.getWallet(network)
    const lpToken = new Contract(lpTokenAddress, erc20Abi, wallet)
    return lpToken
  }

  async getPoolBalance (network: string, token: string) {
    const lpToken = await this.getLpToken(network, token)
    const address = await this.getAddress()
    const [balance, decimals] = await Promise.all([
      lpToken.balanceOf(address),
      lpToken.decimals()
    ])
    return Number(formatUnits(balance.toString(), decimals))
  }

  getCanonicalBridgeContract (destNetwork: string, token: string) {
    const wallet = this.getWallet(ETHEREUM)
    if (destNetwork === ARBITRUM) {
      return new Contract(
        config.tokens[token][destNetwork].l1CanonicalBridge,
        arbitrumGlobalInboxAbi,
        wallet
      )
    } else if (destNetwork === OPTIMISM) {
      return new Contract(
        config.tokens[token][destNetwork].l1CanonicalBridge,
        l1OptimismTokenBridgeAbi,
        wallet
      )
    } else if (destNetwork === XDAI) {
      return new Contract(
        config.tokens[token][destNetwork].l1CanonicalBridge,
        l1xDaiForeignOmniBridgeAbi,
        wallet
      )
    } else {
      throw new Error('not implemented')
    }
  }

  @queue
  async convertToCanonicalToken (
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const recipient = await this.getAddress()
    const value = parseUnits(amount.toString(), 18)
    const tokenBridge = this.getCanonicalBridgeContract(destNetwork, token)
    if (destNetwork === ARBITRUM) {
      return tokenBridge.depositERC20Message(
        config.tokens[token][destNetwork].arbChain,
        config.tokens[token][ETHEREUM].l1CanonicalToken,
        recipient,
        value,
        this.txOverrides(destNetwork)
      )
    } else if (destNetwork === OPTIMISM) {
      const l1TokenAddress = config.tokens[token][ETHEREUM].l1CanonicalToken
      const l2TokenAddress = config.tokens[token][destNetwork].l2CanonicalToken
      return tokenBridge.deposit(
        l1TokenAddress,
        l2TokenAddress,
        recipient,
        value,
        this.txOverrides(destNetwork)
      )
    } else if (destNetwork === XDAI) {
      return tokenBridge.relayTokens(
        config.tokens[token][ETHEREUM].l1CanonicalToken,
        recipient,
        value,
        this.txOverrides(destNetwork)
      )
    } else {
      throw new Error('not implemented')
    }
  }

  @queue
  async polygonCanonicalL1ToL2 (
    amount: string | number,
    approve: boolean = false
  ) {
    const parsedAmount = parseUnits(amount.toString(), 18)
    // dummy erc20
    const tokenAddress = '0x655F2166b0709cd575202630952D71E2bB0d61Af'
    const bridgeAddress = '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74'
    const url = 'https://goerli.rpc.hop.exchange'
    const provider = new providers.StaticJsonRpcProvider(url)
    const wallet = new Wallet(this.privateKey, provider)
    const recipient = await wallet.getAddress()
    if (approve) {
      const erc20Predicate = '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
      const token = new Contract(tokenAddress, erc20Abi, wallet)
      let tx = await token.approve(erc20Predicate, parsedAmount)
      await tx.wait()
    }
    const bridge = new Contract(
      bridgeAddress,
      l1PolygonPosRootChainManagerAbi,
      wallet
    )
    const coder = ethers.utils.defaultAbiCoder
    const data = coder.encode(['uint256'], [parsedAmount])
    return bridge.depositFor(
      recipient,
      tokenAddress,
      data,
      this.txOverrides(POLYGON)
    )
  }

  @queue
  async polygonCanonicalL2ToL1 (amount: string | number) {
    const parsedAmount = parseUnits(amount.toString(), 18)
    // dummy erc20
    const tokenAddress = '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1'
    const url = 'https://rpc-mumbai.maticvigil.com'
    const provider = new providers.StaticJsonRpcProvider(url)
    const wallet = new Wallet(this.privateKey, provider)
    const token = new Contract(tokenAddress, l2PolygonChildErc20Abi, wallet)
    return token.withdraw(parsedAmount, this.txOverrides(POLYGON))
  }

  @queue
  async polygonCanonicalL2ToL1Exit (txHash: string) {
    const url = 'https://goerli.rpc.hop.exchange'
    const provider = new providers.StaticJsonRpcProvider(url)
    const l1Wallet = new Wallet(this.privateKey, provider)
    const Web3 = require('web3')
    const { MaticPOSClient } = require('@maticnetwork/maticjs')
    const maticPOSClient = new MaticPOSClient({
      network: 'testnet',
      maticProvider: new Web3.providers.HttpProvider(
        'https://rpc-mumbai.maticvigil.com'
      ),
      parentProvider: new Web3.providers.HttpProvider(
        'https://goerli.rpc.hop.exchange'
      ),
      posRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      posERC20Predicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
    })

    const tx = await maticPOSClient.exitERC20(txHash, {
      from: await l1Wallet.getAddress(),
      encodeAbi: true
    })

    return l1Wallet.sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  @queue
  async canonicalTokenToHopToken (
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const l1Bridge = this.getHopBridgeContract(ETHEREUM, token)
    const chainId = networkSlugToId(destNetwork)
    const recipient = await this.getAddress()
    const value = parseUnits(amount.toString(), 18)
    const deadline = '0'
    const relayer = ethers.constants.AddressZero
    const relayerFee = '0'
    const amountOutMin = '0'

    return l1Bridge.sendToL2(
      chainId,
      recipient,
      value,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      this.txOverrides(ETHEREUM)
    )
  }

  async addLiquidity (
    network: string,
    token: string,
    token0Amount: string | number
  ) {
    const token1Amount = token0Amount
    const saddleSwap = this.getSaddleSwapContract(network, token)
    const saddleSwapAddress = saddleSwap.address
    const tokenContract = this.getTokenContract(network, token)
    const hTokenContract = this.getHopBridgeTokenContract(network, token)
    let allowance = await this.getAllowance(network, token, saddleSwapAddress)
    if (allowance < Number(token0Amount)) {
      const tx = await this.approve(network, token, saddleSwapAddress)
      await tx?.wait()
    }
    allowance = await this.getAllowance(
      network,
      hTokenContract,
      saddleSwapAddress
    )
    if (allowance < Number(token0Amount)) {
      const tx = await this.approve(network, hTokenContract, saddleSwapAddress)
      await tx?.wait()
    }
    const amount0Desired = parseUnits(token0Amount.toString(), 18)
    const amount1Desired = parseUnits(token1Amount.toString(), 18)
    const recipient = await this.getAddress()
    const deadline = (Date.now() / 1000 + 5 * 60) | 0

    const token0Index = Number(
      (await saddleSwap.getTokenIndex(tokenContract.address)).toString()
    )
    const token1Index = Number(
      (await saddleSwap.getTokenIndex(hTokenContract.address)).toString()
    )
    const amounts = new Array(2).fill(0)
    amounts[token0Index] = amount0Desired
    amounts[token1Index] = amount1Desired
    const minToMint = 0
    return saddleSwap.addLiquidity(
      amounts,
      minToMint,
      deadline,
      this.txOverrides(network)
    )
  }

  async removeLiquidity (
    network: string,
    token: string,
    lpTokenAmount: string | number
  ) {
    const parsedLpTokenAmount = parseUnits(lpTokenAmount.toString(), 18)
    const minAmounts = new Array(2).fill(0)
    const deadline = (Date.now() / 1000 + 5 * 60) | 0
    const saddleSwap = this.getSaddleSwapContract(network, token)
    return saddleSwap.removeLiquidity(
      parsedLpTokenAmount,
      minAmounts,
      deadline,
      this.txOverrides(network)
    )
  }

  @queue
  async bondTransferRoot (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      this.txOverrides(ETHEREUM)
    )
  }

  async bondTransferRootAndWaitForReceipt (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) {
    const tx = await this.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount
    )
    return this.waitForTransactionReceipt(ETHEREUM, tx.hash)
  }

  @queue
  async challengeTransferRoot (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.challengeTransferBond(
      transferRootHash,
      parsedTotalAmount,
      this.txOverrides(ETHEREUM)
    )
  }

  async challengeTransferRootAndWaitForReceipt (
    transferRootHash: string,
    totalAmount: number
  ) {
    const tx = await this.challengeTransferRoot(transferRootHash, totalAmount)
    return this.waitForTransactionReceipt(ETHEREUM, tx.hash)
  }

  @queue
  async resolveChallenge (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.resolveChallenge(
      transferRootHash,
      parsedTotalAmount,
      this.txOverrides(ETHEREUM)
    )
  }

  async resolveChallengeAndWaitForReceipt (
    transferRootHash: string,
    totalAmount: number
  ) {
    const tx = await this.resolveChallenge(transferRootHash, totalAmount)
    return this.waitForTransactionReceipt(ETHEREUM, tx.hash)
  }

  async getChallengePeriod () {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return Number((await bridge.challengePeriod()).toString())
  }

  async getChallengeResolutionPeriod () {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return Number((await bridge.challengeResolutionPeriod()).toString())
  }

  async setChallengePeriodAndTimeSlotSize (
    challengePeriod: number,
    timeSlotSize: number
  ) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const governance = await bridge.governance()
    if (governance !== (await this.getAddress())) {
      throw new Error('must be governance')
    }
    return bridge.setChallengePeriodAndTimeSlotSize(
      challengePeriod,
      timeSlotSize
    )
  }

  async setChallengeResolutionPeriod (challengeResolutionPeriod: number) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const governance = await bridge.governance()
    if (governance !== (await this.getAddress())) {
      throw new Error('must be governance')
    }
    return bridge.setChallengeResolutionPeriod(challengeResolutionPeriod)
  }

  async getChallengeAmountForTransferAmount (amount: number) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const parsedAmount = parseUnits(amount.toString(), 18)
    const challengeAmount = await bridge.getChallengeAmountForTransferAmount(
      parsedAmount
    )
    return Number(formatUnits(challengeAmount, 18).toString())
  }

  @queue
  async addBonder (network: string, token: string, newBonderAddress: string) {
    const address = newBonderAddress.replace('0x', '').toLowerCase()
    const calldata = `0x5325937f000000000000000000000000${address}`
    if (network === ETHEREUM) {
      const bridge = this.getHopBridgeContract(network, token)
      return bridge.addBonder(newBonderAddress, this.txOverrides(network))
    } else if (network === XDAI) {
      const l2Bridge = await this.getHopBridgeContract(network, token)
      const messenger = await this.getMessengerContract(network, token)
      return messenger.requireToPassMessage(
        l2Bridge.address,
        calldata,
        2000000,
        this.txOverrides(network)
      )
    } else if (network === OPTIMISM) {
      const l2Bridge = await this.getHopBridgeContract(network, token)
      const messenger = await this.getMessengerContract(network, token)
      return messenger.sendMessage(
        l2Bridge.address,
        calldata,
        9000000,
        this.txOverrides(network)
      )
    } else if (network === POLYGON) {
      const messenger = await this.getMessengerWrapperContract(network, token)
      return messenger.sendCrossDomainMessage(
        calldata,
        this.txOverrides(network)
      )
    } else if (network === ARBITRUM) {
      const l2Bridge = await this.getHopBridgeContract(network, token)
      const messenger = await this.getMessengerContract(network, token)
      return messenger.createRetryableTicket(
        l2Bridge.address,
        0,
        0,
        await this.getAddress(),
        ethers.constants.AddressZero,
        100000000000,
        0,
        calldata,
        this.txOverrides(network)
      )
    }
  }

  async getCredit (network: string = ETHEREUM) {
    const bonder = await this.getAddress()
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const credit = (await bridge.getCredit(bonder)).toString()
    return Number(formatUnits(credit, 18))
  }

  async getBondForTransferAmount (amount: number) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const parsedAmount = parseUnits(amount.toString(), 18)
    const bondAmount = (
      await bridge.getBondForTransferAmount(parsedAmount)
    ).toString()
    return Number(formatUnits(bondAmount.toString(), 18))
  }

  async getTransferRootCommitedAt (transferRootId: string) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    const commitedAt = await bridge.transferRootCommittedAt(transferRootId)
    return Number(commitedAt.toString())
  }

  async getTransferRootId (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.getTransferRootId(transferRootHash, parsedTotalAmount)
  }

  async getTransferBond (transferRootId: string) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.transferBonds(transferRootId)
  }

  async getMinTransferRootBondDelaySeconds () {
    // MIN_TRANSFER_ROOT_BOND_DELAY
    return 15 * 60
  }

  async getBlockTimestamp (network: string = ETHEREUM) {
    const bridge = this.getHopBridgeContract(network)
    const block = await bridge.provider.getBlock('latest')
    return block.timestamp
  }

  async isChainIdPaused (chainId: string) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.isChainIdPaused(chainId)
  }

  async getCrossDomainMessengerWrapperAddress (chainId: string) {
    const bridge = this.getHopBridgeContract(ETHEREUM)
    return bridge.crossDomainMessengerWrappers(chainId)
  }

  async setMaxPendingTransfers (network: string, max: number) {
    const bridge = this.getHopBridgeContract(network)
    return bridge.setMaxPendingTransfers(max)
  }

  async validateChainId (chainId: string) {
    const isPaused = await this.isChainIdPaused(chainId)
    if (isPaused) {
      throw new Error('chain id is paused')
    }

    const wrapperAddress = await this.getCrossDomainMessengerWrapperAddress(
      chainId
    )
    if (wrapperAddress === ZERO_ADDRESS) {
      throw new Error('wrapper address not set')
    }
  }

  async getMaxPendingTransfers (network: string, token: string = DAI) {
    const bridge = this.getHopBridgeContract(network, token)
    return Number((await bridge.maxPendingTransfers()).toString())
  }

  async getPendingTransfers (
    sourceNetwork: string,
    token: string,
    destNetwork: string
  ) {
    const destChainId = networkSlugToId(destNetwork)
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const maxPendingTransfers = await this.getMaxPendingTransfers(
      sourceNetwork,
      token
    )
    const pendingTransfers: string[] = []
    for (let i = 0; i < maxPendingTransfers; i++) {
      try {
        const pendingTransfer = await bridge.pendingTransferIdsForChainId(
          destChainId,
          i
        )
        pendingTransfers.push(pendingTransfer)
      } catch (err) {
        break
      }
    }

    return pendingTransfers
  }

  async commitTransfers (
    sourceNetwork: string,
    token: string,
    destNetwork: string
  ) {
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const destChainId = networkSlugToId(destNetwork)
    return bridge.commitTransfers(destChainId, this.txOverrides(sourceNetwork))
  }

  async isBonder (sourceNetwork: string, token: string) {
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const address = await this.getAddress()
    return bridge.getIsBonder(address)
  }

  async waitForL2Tx (l1TxHash: string) {
    const watcher = new Watcher({
      l1: {
        provider: this.getProvider(ETHEREUM),
        messengerAddress: '0xb89065D5eB05Cac554FDB11fC764C679b4202322'
      },
      l2: {
        provider: this.getProvider(OPTIMISM),
        messengerAddress: '0x4200000000000000000000000000000000000007'
      }
    })

    const [messageHash] = await watcher.getMessageHashesFromL1Tx(l1TxHash)
    const l2TxReceipt = await watcher.getL2TransactionReceipt(messageHash)
    return l2TxReceipt
  }

  txOverrides (network: string) {
    const txOptions: any = {}
    if (network === OPTIMISM) {
      txOptions.gasPrice = 0
      txOptions.gasLimit = 8000000
    } else if (network === XDAI) {
      txOptions.gasLimit = 5000000
    }
    txOptions.gasLimit = 1000000
    return txOptions
  }
}

export async function checkApproval (
  user: User,
  network: string,
  token: string,
  spender: string
) {
  let allowance = await user.getAllowance(network, token, spender)
  if (allowance < 1000) {
    const tx = await user.approve(network, token, spender)
    console.log('approve tx:', tx?.hash)
    await tx?.wait()
    allowance = await user.getAllowance(network, token, spender)
  }
  expect(allowance).toBeGreaterThan(0)
}

export async function waitForEvent (
  watchers: any[],
  eventName: string,
  predicate?: (data: any) => boolean
) {
  return new Promise((resolve, reject) => {
    watchers.forEach(watcher => {
      watcher
        .on(eventName, (data: any) => {
          console.log('received event:', eventName, data)
          if (typeof predicate === 'function') {
            if (predicate(data)) {
              resolve(null)
              return
            }
          }
          resolve(null)
        })
        .on('error', (err: Error) => {
          reject(err)
        })
    })
  })
}

export function generateUsers (count: number = 1, mnemonic: string) {
  const users: User[] = []
  for (let i = 0; i < count; i++) {
    const path = `m/44'/60'/0'/0/${i}`
    let hdnode = HDNode.fromMnemonic(mnemonic)
    hdnode = hdnode.derivePath(path)
    const privateKey = hdnode.privateKey
    const user = new User(privateKey)
    users.push(user)
  }

  return users
}

export async function prepareAccount (
  user: User,
  sourceNetwork: string,
  token: string
) {
  let balance = await user.getBalance(sourceNetwork, token)
  if (balance < 10) {
    if (sourceNetwork === XDAI) {
      let tx = await user.mint(ETHEREUM, token, 1000)
      await tx?.wait()
      const l1CanonicalBridge = user.getCanonicalBridgeContract(
        sourceNetwork,
        token
      )
      await checkApproval(user, ETHEREUM, token, l1CanonicalBridge.address)
      tx = await user.convertToCanonicalToken(sourceNetwork, token, 1000)
      console.log('tx:', tx.hash)
      await tx?.wait()
      await wait(120 * 1000)
    } else {
      const tx = await user.mint(sourceNetwork, token, 1000)
      await tx?.wait()
    }
    balance = await user.getBalance(sourceNetwork, token)
  }
  expect(balance).toBeGreaterThan(0)
  let spender: string
  if (sourceNetwork === ETHEREUM) {
    spender = user.getBridgeAddress(sourceNetwork, token)
  } else {
    spender = user.getAmmWrapperAddress(sourceNetwork, token)
  }
  await checkApproval(user, sourceNetwork, token, spender)
  // NOTE: xDai SPOA token is required for fees.
  // faucet: https://blockscout.com/poa/sokol/faucet
  if (sourceNetwork === XDAI) {
    const ethBalance = await user.getBalance(sourceNetwork)
    expect(ethBalance).toBeGreaterThan(0)
  }
}

export async function prepareAccounts (
  users: User[],
  faucet: User,
  token: string,
  network: string
) {
  for (let user of users) {
    console.log('preparing account')
    const address = await user.getAddress()
    if ([ETHEREUM, XDAI].includes(network)) {
      let ethBal = await user.getBalance(network)
      if (ethBal < 0.1) {
        console.log('faucet sending eth')
        const tx = await faucet.sendEth(0.1, address, network)
        const receipt = await tx.wait()
        expect(receipt.status).toBe(1)
        ethBal = await user.getBalance(network)
      }
      expect(ethBal).toBeGreaterThanOrEqual(0.1)
    }
    let tokenBal = await user.getBalance(network, token)
    if (tokenBal < 1) {
      console.log('faucet sending tokens')
      const tx = await faucet.sendTokens(network, token, 1000, address)
      await tx.wait()
      tokenBal = await user.getBalance(network, token)
    }
    expect(tokenBal).toBeGreaterThanOrEqual(1)
  }
  return users
}

export async function getBalances (
  users: User[],
  token: string,
  sourceNetwork: string,
  destNetwork: string
): Promise<any[]> {
  return Promise.all([
    Promise.all(
      users.map((user: User) => user.getBalance(sourceNetwork, token))
    ),
    Promise.all(users.map((user: User) => user.getBalance(destNetwork, token)))
  ])
}
