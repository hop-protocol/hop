/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Logger from 'src/logger'
import arbitrumGlobalInboxAbi from '@hop-protocol/core/abi/static/ArbitrumGlobalInbox.json'
import chainSlugToId from 'src/utils/chainSlugToId'
import erc20Abi from '@hop-protocol/core/abi/static/ERC20Mintable.json'
import expect from 'expect'
import getRpcProvider from 'src/utils/getRpcProvider'
import l1ArbitrumMessengerAbi from '@hop-protocol/core/abi/static/L1_ArbitrumMessenger.json'
import l1ArbitrumMessengerWrapperAbi from '@hop-protocol/core/abi/generated/ArbitrumMessengerWrapper.json'
import l1BridgeAbi from '@hop-protocol/core/abi/generated/L1_Bridge.json'
import l1OptimismMessengerAbi from '@hop-protocol/core/abi/static/L1_OptimismMessenger.json'
import l1OptimismMessengerWrapperAbi from '@hop-protocol/core/abi/generated/OptimismMessengerWrapper.json'
import l1OptimismTokenBridgeAbi from '@hop-protocol/core/abi/static/L1_OptimismTokenBridge.json'
import l1PolygonMessengerAbi from '@hop-protocol/core/abi/static/L1_PolygonMessenger.json'
import l1PolygonMessengerWrapperAbi from '@hop-protocol/core/abi/generated/PolygonMessengerWrapper.json'
import l1PolygonPosRootChainManagerAbi from '@hop-protocol/core/abi/static/L1_PolygonPosRootChainManager.json'
import l1xDaiForeignOmniBridgeAbi from '@hop-protocol/core/abi/static/L1_xDaiForeignOmniBridge.json'
import l1xDaiMessengerAbi from '@hop-protocol/core/abi/static/L1_xDaiMessenger.json'
import l1xDaiMessengerWrapperAbi from '@hop-protocol/core/abi/generated/xDaiMessengerWrapper.json'
import l2AmmWrapperAbi from '@hop-protocol/core/abi/generated/L2_AmmWrapper.json'
import l2BridgeAbi from '@hop-protocol/core/abi/generated/L2_Bridge.json'
import l2PolygonChildErc20Abi from '@hop-protocol/core/abi/static/L2_PolygonChildERC20.json'
import saddleSwapAbi from '@hop-protocol/core/abi/generated/Swap.json'
import wait from 'src/utils/wait'
import { BigNumber, Contract, Wallet, ethers, providers } from 'ethers'
import { Chain, Token } from 'src/constants'
import { HDNode } from '@ethersproject/hdnode'
import { Watcher } from '@eth-optimism/watcher'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'
import * as hopMetadata from '@hop-protocol/core/metadata'

const logger = new Logger('test')

export class User {
  privateKey: string

  constructor (privateKey: string) {
    this.privateKey = privateKey
  }

  getProvider (network: string) {
    return getRpcProvider(network)
  }

  getWallet (network: string = Chain.Ethereum) {
    const provider = this.getProvider(network)!
    return new Wallet(this.privateKey, provider)
  }

  async getBalance (
    network: string = Chain.Ethereum,
    token: string | Contract = '',
    address?: string
  ) {
    if (!address) {
      address = await this.getAddress()
    }
    if (!token) {
      const provider = this.getProvider(network)
      const balance = await provider!.getBalance(address)
      return Number(formatUnits(balance, 18))
    }

    const decimals = await getTokenDecimals(token)
    let contract: Contract
    if (typeof token === 'string') {
      contract = this.getTokenContract(network, token)
    } else {
      contract = token
    }
    const bal = await contract.balanceOf(address)
    return Number(formatUnits(bal.toString(), decimals))
  }

  async getHopBalance (network: string = Chain.Ethereum, token: string = '') {
    const contract = this.getHopBridgeTokenContract(network, token)
    return await this.getBalance(network, contract)
  }

  getTokenContract (network: string, token: string) {
    let tokenAddress = globalConfig.tokens[token][network].l2CanonicalToken
    if (network === Chain.Ethereum) {
      tokenAddress = globalConfig.tokens[token][network].l1CanonicalToken
    }
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Abi, wallet)
  }

  getSaddleSwapContract (network: string, token: string) {
    const saddleSwapAddress = globalConfig.tokens[token][network].l2SaddleSwap
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
    const decimals = await getTokenDecimals(token)
    if (!recipient) {
      recipient = await this.getAddress()
    }
    return contract.mint(
      recipient,
      parseUnits(amount.toString(), decimals),
      await this.txOverrides(network)
    )
  }

  async transfer (
    network: string,
    token: string,
    amount: string | number,
    recipient: string
  ) {
    const contract = this.getTokenContract(network, token)
    const decimals = await getTokenDecimals(token)
    return contract.transfer(
      recipient,
      parseUnits(amount.toString(), decimals),
      await this.txOverrides(network)
    )
  }

  getHopBridgeContract (network: string, token: string = Token.USDC) {
    let bridgeAddress: string
    let artifact: any
    if (network === Chain.Ethereum) {
      bridgeAddress = globalConfig.tokens[token][network].l1Bridge
      artifact = l1BridgeAbi
    } else {
      bridgeAddress = globalConfig.tokens[token][network].l2Bridge
      artifact = l2BridgeAbi
    }

    const wallet = this.getWallet(network)
    return new Contract(bridgeAddress, artifact, wallet)
  }

  getHopBridgeTokenContract (network: string, token: string) {
    const tokenAddress = globalConfig.tokens[token][network].l2HopBridgeToken
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Abi, wallet)
  }

  async getMessengerWrapperContract (
    network: string,
    token: string = Token.USDC
  ) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum, token)
    const chainId = chainSlugToId(network)
    const wrapperAddress = await bridge.crossDomainMessengerWrappers(chainId)
    if (wrapperAddress === ethers.constants.AddressZero) {
      throw new Error(`wrapper address is ${wrapperAddress}`)
    }
    const wallet = this.getWallet(Chain.Ethereum)
    let abi: any
    if (network === Chain.Arbitrum) {
      abi = l1ArbitrumMessengerWrapperAbi
    } else if (network === Chain.Optimism) {
      abi = l1OptimismMessengerWrapperAbi
    } else if (network === Chain.Gnosis) {
      abi = l1xDaiMessengerWrapperAbi
    } else if (network === Chain.Polygon) {
      abi = l1PolygonMessengerWrapperAbi
    }
    return new Contract(wrapperAddress, abi, wallet)
  }

  async getMessengerContract (network: string, token: string = Token.USDC) {
    if (network === Chain.Ethereum) {
      throw new Error('not supported')
    }
    const wrapper = await this.getMessengerWrapperContract(network, token)
    const wallet = this.getWallet(Chain.Ethereum)
    let messengerAddress: string
    let abi: any
    if (network === Chain.Arbitrum) {
      messengerAddress = await wrapper.arbInbox()
      abi = l1ArbitrumMessengerAbi
    } else if (network === Chain.Optimism) {
      messengerAddress = await wrapper.l1MessengerAddress()
      abi = l1OptimismMessengerAbi
    } else if (network === Chain.Gnosis) {
      messengerAddress = await wrapper.l1MessengerAddress()
      abi = l1xDaiMessengerAbi
    } else if (network === Chain.Polygon) {
      messengerAddress = await wrapper.address
      abi = l1PolygonMessengerAbi
    } else {
      throw new Error(`${network} not supported`)
    }
    return new Contract(messengerAddress, abi, wallet)
  }

  getAmmWrapperContract (network: string, token: string = Token.USDC) {
    const wrapperAddress = globalConfig.tokens[token][network].l2AmmWrapper
    const wallet = this.getWallet(network)
    return new Contract(wrapperAddress, l2AmmWrapperAbi, wallet)
  }

  async approve (
    network: string,
    token: string | Contract,
    spender: string,
    amount?: string | number
  ) {
    let contract: Contract
    const decimals = await getTokenDecimals(token)
    if (typeof token === 'string') {
      contract = this.getTokenContract(network, token)
    } else {
      contract = token
    }
    let approveAmount: BigNumber | string = ethers.constants.MaxUint256
    if (amount) {
      approveAmount = parseUnits(amount.toString(), decimals).toString()
    }
    return contract.approve(
      spender,
      approveAmount,
      await this.txOverrides(network)
    )
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
    const decimals = await getTokenDecimals(token)
    return Number(formatUnits(allowance, decimals))
  }

  async getAddress () {
    const wallet = this.getWallet()
    return await wallet.getAddress()
  }

  async getTransactionReceipt (network: string, txHash: string) {
    const provider = this.getProvider(network)!
    return await provider.getTransactionReceipt(txHash)
  }

  async waitForTransactionReceipt (network: string, txHash: string) {
    const provider = this.getProvider(network)!
    return await provider.waitForTransaction(txHash)
  }

  async send (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    if (sourceNetwork === Chain.Ethereum) {
      return await this.sendL1ToL2(sourceNetwork, destNetwork, token, amount)
    }
    if (destNetwork === Chain.Ethereum) {
      return await this.sendL2ToL1(sourceNetwork, destNetwork, token, amount)
    }

    return await this.sendL2ToL2(sourceNetwork, destNetwork, token, amount)
  }

  isNativeToken (network: string, token: string) {
    const isEth = token === 'ETH' && network === Chain.Ethereum
    const isMatic = token === 'MATIC' && network === Chain.Polygon
    const isxDai = token === 'XDAI' && network === Chain.Gnosis
    return isEth || isMatic || isxDai
  }

  async sendL1ToL2 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const deadline = (Date.now() / 1000 + 300) | 0
    const amountOutMin = '0'
    const chainId = chainSlugToId(destNetwork)
    const recipient = await this.getAddress()
    const relayer = ethers.constants.AddressZero
    const relayerFee = '0'
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const ethBalance = await this.getBalance()
    if (ethBalance < 0.0001) {
      throw new Error('Not enough ETH balance for transfer')
    }

    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)
    const tx = bridge.sendToL2(
      chainId,
      recipient,
      parsedAmount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      {
        ...(await this.txOverrides(sourceNetwork)),
        value: this.isNativeToken(sourceNetwork, token) ? parsedAmount : undefined
      }
    )

    return tx
  }

  async sendL2ToL1 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const deadline = ((Date.now() / 1000) | 0) + 300
    const chainId = chainSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const recipient = await this.getAddress()
    let destinationAmountOutMin = 0
    let destinationDeadline = deadline
    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)

    if (destNetwork === Chain.Ethereum) {
      destinationAmountOutMin = 0
      destinationDeadline = 0
    }

    const wrapper = this.getAmmWrapperContract(sourceNetwork, token)
    await this.checkApproval(sourceNetwork, token, wrapper.address)

    const balance = await this.getBalance(sourceNetwork, token)
    logger.debug('token balance:', balance)

    const hopBalance = await this.getHopBalance(sourceNetwork, token)
    logger.debug('token hop balance:', hopBalance)

    const allowance = await this.getAllowance(
      sourceNetwork,
      token,
      wrapper.address
    )
    if (allowance < amount) {
      throw new Error('not enough allowance')
    }

    const debug = false
    if (debug) {
      logger.debug(`wrapper.swapAndSend(
      ${chainId},
      ${recipient},
      ${parsedAmount.toString()},
      ${bonderFee.toString()},
      ${amountOutMin.toString()},
      ${deadline},
      ${destinationAmountOutMin.toString()},
      ${destinationDeadline},
    )`)
    }

    return wrapper.swapAndSend(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      {
        ...(await this.txOverrides(sourceNetwork)),
        value: this.isNativeToken(sourceNetwork, token) ? parsedAmount : undefined
      }
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
    const sourceChainId = chainSlugToId(sourceNetwork)!
    const chainId = chainSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const destinationAmountOutMin = '0'
    const destinationDeadline = (Date.now() / 1000 + 300) | 0
    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)

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
      {
        ...(await this.txOverrides(sourceNetwork)),
        value: this.isNativeToken(sourceNetwork, token) ? parsedAmount : undefined
      }
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
    const chainId = chainSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    return bridge.send(
      chainId,
      recipient,
      parsedAmount,
      bonderFee,
      amountOutMin,
      deadline,
      await this.txOverrides(sourceNetwork)
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
    const chainId = chainSlugToId(destNetwork)
    const bonderFee = await this.getBonderFee(
      sourceNetwork,
      token,
      amount.toString()
    )
    const amountOutMin = '0'
    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)
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
      await this.txOverrides(sourceNetwork)
    )
  }

  async sendAndWaitForReceipt (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const tx = await this.send(sourceNetwork, destNetwork, token, amount)
    return await this.waitForTransactionReceipt(sourceNetwork, tx.hash)
  }

  async sendEth (amount: number | string, recipient: string, network?: string) {
    const wallet = this.getWallet(network)
    return await wallet.sendTransaction({
      ...(await this.txOverrides(network!)),
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
    const decimals = await getTokenDecimals(token)
    const tx = await tokenContract.transfer(
      recipient,
      parseUnits(amount.toString(), decimals),
      await this.txOverrides(network)
    )
    return tx
  }

  async checkApproval (network: string, token: string, spender: string) {
    return await checkApproval(this, network, token, spender)
  }

  async stake (network: string, token: string, amount: number) {
    const decimals = await getTokenDecimals(token)
    const parsedAmount = parseUnits(amount.toString(), decimals)
    const bonder = await this.getAddress()
    const bridge = this.getHopBridgeContract(network, token)
    return bridge.stake(bonder, parsedAmount, await this.txOverrides(network))
  }

  async getBonderFee (network: string, token: string, amount: string) {
    const decimals = await getTokenDecimals(token)
    const bridge = this.getHopBridgeContract(network, token)
    const minBonderBps = await bridge.minBonderBps()
    const minBonderFeeAbsolute = await bridge.minBonderFeeAbsolute()
    const minBonderFeeRelative = parseUnits(amount, decimals)
      .mul(minBonderBps)
      .div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

  getBridgeAddress (network: string, token: string) {
    let address = globalConfig.tokens[token][network].l2Bridge
    if (network === Chain.Ethereum) {
      address = globalConfig.tokens[token][network].l1Bridge
    }
    return address
  }

  getAmmWrapperAddress (network: string, token: string) {
    return globalConfig.tokens[token][network].l2AmmWrapper
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
    const wallet = this.getWallet(Chain.Ethereum)
    if (destNetwork === Chain.Arbitrum) {
      return new Contract(
        globalConfig.tokens[token][destNetwork].l1CanonicalBridge,
        arbitrumGlobalInboxAbi,
        wallet
      )
    } else if (destNetwork === Chain.Optimism) {
      return new Contract(
        globalConfig.tokens[token][destNetwork].l1CanonicalBridge,
        l1OptimismTokenBridgeAbi,
        wallet
      )
    } else if (destNetwork === Chain.Gnosis) {
      return new Contract(
        globalConfig.tokens[token][destNetwork].l1CanonicalBridge,
        l1xDaiForeignOmniBridgeAbi,
        wallet
      )
    } else if (destNetwork === Chain.Polygon) {
      return new Contract(
        globalConfig.tokens[token][destNetwork].l1PosRootChainManager,
        l1PolygonPosRootChainManagerAbi,
        wallet
      )
    } else {
      throw new Error('not implemented')
    }
  }

  async convertToCanonicalToken (
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const recipient = await this.getAddress()
    const decimals = await getTokenDecimals(token)
    const value = parseUnits(amount.toString(), decimals)
    const tokenBridge = this.getCanonicalBridgeContract(destNetwork, token)
    if (destNetwork === Chain.Arbitrum) {
      return tokenBridge.depositERC20Message(
        globalConfig.tokens[token][destNetwork].arbChain,
        globalConfig.tokens[token][Chain.Ethereum].l1CanonicalToken,
        recipient,
        value,
        await this.txOverrides(destNetwork)
      )
    } else if (destNetwork === Chain.Optimism) {
      const l1TokenAddress =
        globalConfig.tokens[token][Chain.Ethereum].l1CanonicalToken
      const l2TokenAddress = globalConfig.tokens[token][destNetwork].l2CanonicalToken
      return tokenBridge.deposit(
        l1TokenAddress,
        l2TokenAddress,
        recipient,
        value,
        await this.txOverrides(destNetwork)
      )
    } else if (destNetwork === Chain.Gnosis) {
      return tokenBridge.relayTokens(
        globalConfig.tokens[token][Chain.Ethereum].l1CanonicalToken,
        recipient,
        value,
        await this.txOverrides(destNetwork)
      )
    } else if (destNetwork === Chain.Polygon) {
      const approveAddress = globalConfig.tokens[token][destNetwork].l1PosPredicate
      logger.debug('approving')
      const tx = await this.approve(Chain.Ethereum, token, approveAddress)
      await tx?.wait()
      logger.debug('waiting')
      const coder = ethers.utils.defaultAbiCoder
      const payload = coder.encode(['uint256'], [value])
      return tokenBridge.depositFor(
        recipient,
        globalConfig.tokens[token][Chain.Ethereum].l1CanonicalToken,
        payload,
        await this.txOverrides(destNetwork)
      )
    } else {
      throw new Error('not implemented')
    }
  }

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
      const tx = await token.approve(erc20Predicate, parsedAmount)
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
      await this.txOverrides(Chain.Polygon)
    )
  }

  async polygonCanonicalL2ToL1 (amount: string | number) {
    const parsedAmount = parseUnits(amount.toString(), 18)
    // dummy erc20
    const tokenAddress = '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1'
    const url = 'https://rpc-mumbai.maticvigil.com'
    const provider = new providers.StaticJsonRpcProvider(url)
    const wallet = new Wallet(this.privateKey, provider)
    const token = new Contract(tokenAddress, l2PolygonChildErc20Abi, wallet)
    return token.withdraw(parsedAmount, await this.txOverrides(Chain.Polygon))
  }

  async polygonCanonicalL2ToL1Exit (txHash: string) {
    const url = 'https://goerli.rpc.hop.exchange'
    const provider = new providers.StaticJsonRpcProvider(url)
    const l1Wallet = new Wallet(this.privateKey, provider)
    const Web3 = require('web3') // eslint-disable-line @typescript-eslint/no-var-requires
    const { MaticPOSClient } = require('@maticnetwork/maticjs') // eslint-disable-line @typescript-eslint/no-var-requires
    const maticPOSClient = new MaticPOSClient({
      network: 'testnet',
      maticProvider: new Web3.providers.HttpProvider(
        'https://rpc-mumbai.maticvigil.com'
      ),
      parentProvider: new Web3.providers.HttpProvider(
        'https://goerli.rpc.hop.exchange'
      )
    })

    const tx = await maticPOSClient.exitERC20(txHash, {
      from: await l1Wallet.getAddress(),
      encodeAbi: true
    })

    return await l1Wallet.sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  async canonicalTokenToHopToken (
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const l1Bridge = this.getHopBridgeContract(Chain.Ethereum, token)
    const chainId = chainSlugToId(destNetwork)
    const recipient = await this.getAddress()
    const decimals = await getTokenDecimals(token)
    const value = parseUnits(amount.toString(), decimals)
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
      await this.txOverrides(Chain.Ethereum)
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
      await this.txOverrides(network)
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
      await this.txOverrides(network)
    )
  }

  async bondTransferRoot (
    transferRootHash: string,
    chainId: number,
    totalAmount: number
  ) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      await this.txOverrides(Chain.Ethereum)
    )
  }

  async bondTransferRootAndWaitForReceipt (
    transferRootHash: string,
    chainId: number,
    totalAmount: number
  ) {
    const tx = await this.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount
    )
    return await this.waitForTransactionReceipt(Chain.Ethereum, tx.hash)
  }

  async challengeTransferRoot (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.challengeTransferBond(
      transferRootHash,
      parsedTotalAmount,
      await this.txOverrides(Chain.Ethereum)
    )
  }

  async challengeTransferRootAndWaitForReceipt (
    transferRootHash: string,
    totalAmount: number
  ) {
    const tx = await this.challengeTransferRoot(transferRootHash, totalAmount)
    return await this.waitForTransactionReceipt(Chain.Ethereum, tx.hash)
  }

  async resolveChallenge (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.resolveChallenge(
      transferRootHash,
      parsedTotalAmount,
      await this.txOverrides(Chain.Ethereum)
    )
  }

  async resolveChallengeAndWaitForReceipt (
    transferRootHash: string,
    totalAmount: number
  ) {
    const tx = await this.resolveChallenge(transferRootHash, totalAmount)
    return await this.waitForTransactionReceipt(Chain.Ethereum, tx.hash)
  }

  async getChallengePeriod () {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return Number((await bridge.challengePeriod()).toString())
  }

  async getChallengeResolutionPeriod () {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return Number((await bridge.challengeResolutionPeriod()).toString())
  }

  async setChallengePeriodAndTimeSlotSize (
    challengePeriod: number,
    timeSlotSize: number
  ) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
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
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    const governance = await bridge.governance()
    if (governance !== (await this.getAddress())) {
      throw new Error('must be governance')
    }
    return bridge.setChallengeResolutionPeriod(
      challengeResolutionPeriod,
      await this.txOverrides(Chain.Ethereum)
    )
  }

  async getChallengeAmountForTransferAmount (amount: number) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    const parsedAmount = parseUnits(amount.toString(), 18)
    const challengeAmount = await bridge.getChallengeAmountForTransferAmount(
      parsedAmount
    )
    return Number(formatUnits(challengeAmount, 18).toString())
  }

  async addBonder (network: string, token: string, newBonderAddress: string) {
    const address = newBonderAddress.replace('0x', '').toLowerCase()
    const calldata = `0x5325937f000000000000000000000000${address}`
    if (network === Chain.Ethereum) {
      const bridge = this.getHopBridgeContract(network, token)
      return bridge.addBonder(newBonderAddress, await this.txOverrides(network))
    } else if (network === Chain.Gnosis) {
      const l2Bridge = await this.getHopBridgeContract(network, token)
      const messenger = await this.getMessengerContract(network, token)
      return messenger.requireToPassMessage(
        l2Bridge.address,
        calldata,
        2000000,
        await this.txOverrides(network)
      )
    } else if (network === Chain.Optimism) {
      const l2Bridge = await this.getHopBridgeContract(network, token)
      const messenger = await this.getMessengerContract(network, token)
      return messenger.sendMessage(
        l2Bridge.address,
        calldata,
        9000000,
        await this.txOverrides(network)
      )
    } else if (network === Chain.Polygon) {
      const messenger = await this.getMessengerWrapperContract(network, token)
      return messenger.sendCrossDomainMessage(
        calldata,
        await this.txOverrides(network)
      )
    } else if (network === Chain.Arbitrum) {
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
        await this.txOverrides(network)
      )
    }
  }

  async getCredit (network: string = Chain.Ethereum) {
    const bonder = await this.getAddress()
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    const credit = (await bridge.getCredit(bonder)).toString()
    return Number(formatUnits(credit, 18))
  }

  async getBondForTransferAmount (amount: number) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    const parsedAmount = parseUnits(amount.toString(), 18)
    const bondAmount = (
      await bridge.getBondForTransferAmount(parsedAmount)
    ).toString()
    return Number(formatUnits(bondAmount.toString(), 18))
  }

  async getTransferRootCommittedAt (destChainId: number, transferRootId: string, tokenSymbol: string) {
    let params: any[] = []
    if (tokenSymbol === 'USDC') {
      params = [transferRootId]
    } else {
      params = [destChainId, transferRootId]
    }

    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    const committedAt = await bridge.transferRootCommittedAt(...params)
    return Number(committedAt.toString())
  }

  async getTransferRootId (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.getTransferRootId(transferRootHash, parsedTotalAmount)
  }

  async getTransferBond (transferRootId: string) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.transferBonds(transferRootId)
  }

  async getMinTransferRootBondDelaySeconds () {
    // MIN_TRANSFER_ROOT_BOND_DELAY
    return 15 * 60
  }

  async getBlockTimestamp (network: string = Chain.Ethereum) {
    const bridge = this.getHopBridgeContract(network)
    const block = await bridge.provider.getBlock('latest')
    return block.timestamp
  }

  async isChainIdPaused (chainId: number) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.isChainIdPaused(chainId)
  }

  async getCrossDomainMessengerWrapperAddress (chainId: number) {
    const bridge = this.getHopBridgeContract(Chain.Ethereum)
    return bridge.crossDomainMessengerWrappers(chainId)
  }

  async setMaxPendingTransfers (network: string, max: number) {
    const bridge = this.getHopBridgeContract(network)
    return bridge.setMaxPendingTransfers(max, await this.txOverrides(network))
  }

  async validateChainId (chainId: number) {
    const isPaused = await this.isChainIdPaused(chainId)
    if (isPaused) {
      throw new Error('chain id is paused')
    }

    const wrapperAddress = await this.getCrossDomainMessengerWrapperAddress(
      chainId
    )
    if (wrapperAddress === ethers.constants.AddressZero) {
      throw new Error('wrapper address not set')
    }
  }

  async getMaxPendingTransfers (network: string, token: string = Token.USDC) {
    const bridge = this.getHopBridgeContract(network, token)
    return Number((await bridge.maxPendingTransfers()).toString())
  }

  async getPendingTransfers (
    sourceNetwork: string,
    token: string,
    destNetwork: string
  ) {
    const destChainId = chainSlugToId(destNetwork)
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
    const destChainId = chainSlugToId(destNetwork)
    return bridge.commitTransfers(
      destChainId,
      await this.txOverrides(sourceNetwork)
    )
  }

  async isBonder (sourceNetwork: string, token: string) {
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const address = await this.getAddress()
    return bridge.getIsBonder(address)
  }

  async isGovernance (sourceNetwork: string, token: string) {
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const address = await this.getAddress()
    let governance: string
    if (sourceNetwork === Chain.Ethereum) {
      governance = await bridge.governance()
    } else {
      governance = await bridge.l1Governance()
    }
    return governance === address
  }

  async waitForL2Tx (l1TxHash: string) {
    const watcher = new Watcher({
      l1: {
        provider: this.getProvider(Chain.Ethereum),
        messengerAddress: '0xb89065D5eB05Cac554FDB11fC764C679b4202322'
      },
      l2: {
        provider: this.getProvider(Chain.Optimism),
        messengerAddress: '0x4200000000000000000000000000000000000007'
      }
    })

    const [messageHash] = await watcher.getMessageHashesFromL1Tx(l1TxHash)
    const l2TxReceipt = await watcher.getL2TransactionReceipt(messageHash)
    return l2TxReceipt
  }

  protected async getBumpedGasPrice (
    network: string,
    percent: number
  ): Promise<BigNumber> {
    const provider = this.getProvider(network)!
    const gasPrice = await provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  async txOverrides (network: string) {
    const txOptions: any = {}
    if (globalConfig.isMainnet) {
      // txOptions.gasLimit = 1_000_000
      txOptions.gasPrice = (
        await this.getBumpedGasPrice(network, 1.5)
      ).toString()
    } else {
      txOptions.gasLimit = 2_000_000
      if (network === Chain.Gnosis) {
        txOptions.gasPrice = 1_000_000_000
        txOptions.gasLimit = 4_000_000
      }
    }

    // Optimism has a constant gasPrice
    if (network === Chain.Optimism) {
      txOptions.gasPrice = 15_000_000
      txOptions.gasLimit = undefined
    }

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
    logger.debug('approve tx:', tx?.hash)
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
  return await new Promise((resolve, reject) => {
    watchers.forEach(watcher => {
      watcher
        .on(eventName, (data: any) => {
          logger.debug('received event:', eventName, data)
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

export function generateUser (privateKey: string) {
  return new User(privateKey)
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
  if (balance < 1000) {
    if (sourceNetwork === Chain.Gnosis) {
      let tx = await user.mint(Chain.Ethereum, token, 1000)
      await tx?.wait()
      const l1CanonicalBridge = user.getCanonicalBridgeContract(
        sourceNetwork,
        token
      )
      await checkApproval(
        user,
        Chain.Ethereum,
        token,
        l1CanonicalBridge.address
      )
      tx = await user.convertToCanonicalToken(sourceNetwork, token, 1000)
      logger.info('tx:', tx.hash)
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
  if (sourceNetwork === Chain.Ethereum) {
    spender = user.getBridgeAddress(sourceNetwork, token)
  } else {
    spender = user.getAmmWrapperAddress(sourceNetwork, token)
  }
  await checkApproval(user, sourceNetwork, token, spender)
  // NOTE: Gnosis SPOA token is required for fees.
  // faucet: https://blockscout.com/poa/sokol/faucet
  if (sourceNetwork === Chain.Gnosis) {
    const ethBalance = await user.getBalance(sourceNetwork)
    expect(ethBalance).toBeGreaterThan(0)
  }
}

export async function prepareAccounts (
  users: User[],
  faucet: User,
  token: string,
  network: string,
  faucetTokensToSend: number = 100
) {
  const faucetSendEth = !globalConfig.isMainnet
  let i = 0
  for (const user of users) {
    logger.debug('preparing account')
    const address = await user.getAddress()
    const yes = [Chain.Ethereum as string, Chain.Gnosis].includes(network)
    let checkEth = true
    if (!globalConfig.isMainnet) {
      checkEth = [Chain.Ethereum as string, Chain.Gnosis].includes(network)
    }
    if (checkEth) {
      let ethBal = await user.getBalance(network)
      logger.debug(`#${i} eth:`, ethBal)
      if (faucetSendEth && ethBal < 0.01) {
        logger.debug('faucet sending eth')
        const tx = await faucet.sendEth(0.1, address, network)
        const receipt = await tx.wait()
        expect(receipt.status).toBe(1)
        ethBal = await user.getBalance(network)
        expect(ethBal).toBeGreaterThanOrEqual(0.1)
      }
    }
    const isNativeToken = user.isNativeToken(network, token)
    let tokenBal: number
    if (isNativeToken) {
      tokenBal = await user.getBalance(network)
    } else {
      tokenBal = await user.getBalance(network, token)
    }
    logger.debug(`#${i} token balance: ${tokenBal}`)
    if (tokenBal < faucetTokensToSend) {
      logger.debug('faucet sending tokens')
      let faucetBalance: number
      if (isNativeToken) {
        faucetBalance = await faucet.getBalance(network)
      } else {
        faucetBalance = await faucet.getBalance(network, token)
      }
      if (faucetBalance < faucetTokensToSend) {
        throw new Error(
          `faucet does not have enough tokens. Have ${faucetBalance}, need ${faucetTokensToSend} ${token} on ${network}`
        )
      }

      let tx: any
      if (isNativeToken) {
        tx = await faucet.sendEth(faucetTokensToSend, address, network)
      } else {
        tx = await faucet.sendTokens(
          network,
          token,
          faucetTokensToSend,
          address
        )
      }
      logger.debug('send tokens tx:', tx.hash)
      await tx.wait()
      if (isNativeToken) {
        tokenBal = await user.getBalance(network)
      } else {
        tokenBal = await user.getBalance(network, token)
      }
    }
    expect(tokenBal).toBeGreaterThanOrEqual(faucetTokensToSend)
    i++
  }
  return users
}

export async function getBalances (
  users: User[],
  token: string,
  sourceNetwork: string,
  destNetwork: string
): Promise<[number[], number[]]> {
  return await Promise.all([
    Promise.all(
      users.map(async (user: User) => await user.getBalance(sourceNetwork, token))
    ),
    Promise.all(users.map(async (user: User) => await user.getBalance(destNetwork, token)))
  ])
}

async function getTokenDecimals (token: string | Contract): Promise<number> {
  let tokenSymbol: string
  if (typeof token === 'string') {
    tokenSymbol = token
  } else {
    tokenSymbol = await token.symbol()
  }

  // If this is an hToken, strip the h
  if (tokenSymbol[0] === 'h') {
    tokenSymbol = tokenSymbol.substring(1)
  }

  // The decimals will be the same on all networks
  return hopMetadata.mainnet.tokens[tokenSymbol]?.decimals
}
