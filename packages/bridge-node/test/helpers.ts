import { ethers, Contract } from 'ethers'
import { NonceManager } from '@ethersproject/experimental'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { tokens } from 'src/config'
import { arbitrumNetworkId } from 'src/constants'
import l1BridgeArtifact from 'src/abi/L1_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2_Bridge.json'
import erc20Artifact from 'src/abi/ERC20.json'
import uniswapRouterArtifact from 'src/abi/UniswapV2Router02.json'
import uniswapPairArtifact from 'src/abi/UniswapV2Pair.json'
import globalInboxArtifact from 'src/abi/GlobalInbox.json'
import { UINT256, KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import { getRpcUrl, networkSlugToId } from 'src/utils'

export class User {
  privateKey: string
  nonceManagers: any = {}

  constructor (privateKey: string) {
    this.privateKey = privateKey
  }

  getProvider (network: string) {
    const url = getRpcUrl(network)
    return new ethers.providers.StaticJsonRpcProvider(url)
  }

  getWallet (network: string = KOVAN) {
    //const provider = this.getProvider(network)
    //return new ethers.Wallet(this.privateKey, provider)

    if (!this.nonceManagers[network]) {
      const provider = this.getProvider(network)
      const wallet = new ethers.Wallet(this.privateKey, provider)
      //const wallet = this.getWallet(network)
      this.nonceManagers[network] = new NonceManager(wallet)
    }
    return this.nonceManagers[network]
  }

  async getBalance (network: string = KOVAN, token: string | Contract = '') {
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
    const balance = await contract.balanceOf(address)
    return Number(formatUnits(balance, 18))
  }

  async getHopBalance (network: string = KOVAN, token: string = '') {
    const contract = this.getHopBridgeTokenContract(network, token)
    return this.getBalance(network, contract)
  }

  getTokenContract (network: string, token: string) {
    let tokenAddress = tokens[token][network].l2CanonicalToken
    if (network === KOVAN) {
      tokenAddress = tokens[token][network].l1CanonicalToken
    }
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Artifact.abi, wallet)
  }

  getUniswapRouterContract (network: string, token: string) {
    let routerAddress = tokens[token][network].uniswapRouter
    const wallet = this.getWallet(network)
    return new Contract(routerAddress, uniswapRouterArtifact.abi, wallet)
  }

  getUniswapPairContract (network: string, token: string) {
    let pairAddress = tokens[token][network].uniswapExchange
    const wallet = this.getWallet(network)
    return new Contract(pairAddress, uniswapPairArtifact.abi, wallet)
  }

  async mint (network: string, token: string, amount: string | number) {
    const wallet = this.getWallet(network)
    const contract = this.getTokenContract(network, token)
    const recipient = await this.getAddress()
    return contract.mint(recipient, parseUnits(amount.toString(), 18))
  }

  async transfer (
    network: string,
    token: string,
    amount: string | number,
    recipient: string
  ) {
    const wallet = this.getWallet(network)
    const contract = this.getTokenContract(network, token)
    return contract.transfer(recipient, parseUnits(amount.toString(), 18))
  }

  getHopBridgeContract (network: string, token: string) {
    let bridgeAddress: string
    let artifact: any
    if (network === KOVAN) {
      bridgeAddress = tokens[token][network].l1Bridge
      artifact = l1BridgeArtifact
    } else {
      bridgeAddress = tokens[token][network].l2Bridge
      artifact = l2BridgeArtifact
    }

    const wallet = this.getWallet(network)
    return new Contract(bridgeAddress, artifact.abi, wallet)
  }

  getHopBridgeTokenContract (network: string, token: string) {
    let tokenAddress = tokens[token][network].l2HopBridgeToken
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Artifact.abi, wallet)
  }

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
    return contract.approve(spender, approveAmount)
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
    if (sourceNetwork === KOVAN) {
      return this.sendL1ToL2(sourceNetwork, destNetwork, token, amount)
    }
    if (destNetwork === KOVAN) {
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
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const ethBalance = await this.getBalance()
    if (ethBalance < 0.0001) {
      throw new Error('Not enough ETH balance for transfer')
    }

    const tx = bridge.sendToL2AndAttemptSwap(
      chainId,
      recipient,
      parseUnits(amount.toString(), 18),
      amountOutMin,
      deadline,
      {}
    )

    this.getWallet(sourceNetwork).incrementTransactionNonce()
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
    const relayerFee = '0'
    const amountOutIn = '0'
    const recipient = await this.getAddress()
    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    let destinationAmountOutMin = '0'
    let destinationDeadline = deadline

    if (destNetwork === KOVAN) {
      destinationAmountOutMin = '0'
      destinationDeadline = 0
    }

    return bridge.swapAndSend(
      chainId,
      recipient,
      parseUnits(amount.toString(), 18),
      relayerFee,
      amountOutIn,
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
    const deadline = (Date.now() / 1000 + 300) | 0
    const chainId = networkSlugToId(destNetwork)
    const relayerFee = '0'
    const amountOutIn = '0'
    const destinationAmountOutMin = '0'
    const parsedAmount = parseUnits(amount.toString(), 18)
    const wallet = this.getWallet(sourceNetwork)

    const bridge = this.getHopBridgeContract(sourceNetwork, token)
    const recipient = await this.getAddress()
    const tx = await bridge.swapAndSend(
      chainId,
      recipient,
      parsedAmount,
      relayerFee,
      amountOutIn,
      deadline,
      destinationAmountOutMin,
      deadline
    )

    return tx
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

  async sendEth (amount: number | string, recipient: string) {
    const wallet = this.getWallet()
    return wallet.sendTransaction({
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
    const wallet = this.getWallet()
    const tokenContract = this.getTokenContract(network, token)
    return tokenContract.transfer(recipient, parseUnits(amount.toString(), 18))
  }

  getBridgeAddress (network: string, token: string) {
    let address = tokens[token][network].l2Bridge
    if (network === KOVAN) {
      address = tokens[token][network].l1Bridge
    }
    return address
  }

  async calcToken1Rate (network: string, token: string) {
    const address = await this.getAddress()
    const uniswapRouter = this.getUniswapRouterContract(network, token)
    const uniswapExchange = this.getUniswapPairContract(network, token)

    const [decimals, totalSupply, balance, reserves] = await Promise.all([
      uniswapExchange.decimals(),
      uniswapExchange.totalSupply(),
      uniswapExchange.balanceOf(address),
      uniswapExchange.getReserves()
    ])

    const formattedTotalSupply = formatUnits(
      totalSupply.toString(),
      Number(decimals.toString())
    )

    // user pool balance
    const formattedBalance = formatUnits(balance.toString(), decimals)

    const poolPercentage =
      (Number(formattedBalance) / Number(formattedTotalSupply)) * 100

    // user pool token percentage
    const formattedPoolPercentage =
      poolPercentage.toFixed(2) === '0.00' ? '<0.01' : poolPercentage.toFixed(2)

    const reserve0 = formatUnits(reserves[0].toString(), decimals)
    const reserve1 = formatUnits(reserves[1].toString(), decimals)

    const token0Deposited =
      (Number(formattedBalance) * Number(reserve0)) /
      Number(formattedTotalSupply)
    const token1Deposited =
      (Number(formattedBalance) * Number(reserve1)) /
      Number(formattedTotalSupply)

    const amount0 = parseUnits('1', decimals)
    const amount1 = await uniswapRouter?.quote(
      amount0,
      parseUnits(reserve0, decimals),
      parseUnits(reserve1, decimals)
    )
    const formattedAmountB = formatUnits(amount1, decimals)
    const token1Rate = formattedAmountB
    return token1Rate
  }

  async getPoolBalance (network: string, token: string) {
    const uniswapExchange = this.getUniswapPairContract(network, token)
    const address = await this.getAddress()
    const [balance, decimals] = await Promise.all([
      uniswapExchange.balanceOf(address),
      uniswapExchange.decimals()
    ])
    return formatUnits(balance.toString(), decimals)
  }

  getCanonicalBridgeContract (destNetwork: string, token: string) {
    const wallet = this.getWallet(KOVAN)
    if (destNetwork === ARBITRUM) {
      return new Contract(
        tokens[token][destNetwork].l1CanonicalBridge,
        globalInboxArtifact.abi,
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
    const value = parseUnits(amount.toString(), 18)
    if (destNetwork === ARBITRUM) {
      const messenger = this.getCanonicalBridgeContract(destNetwork, token)
      return messenger.depositERC20Message(
        tokens[token][destNetwork].arbChain,
        tokens[token][KOVAN].l1CanonicalToken,
        recipient,
        value
      )
    } else {
      throw new Error('not implemented')
    }
  }

  async canonicalTokenToHopToken (
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const l1Bridge = this.getHopBridgeContract(KOVAN, token)
    const recipient = await this.getAddress()
    const value = parseUnits(amount.toString(), 18)
    return l1Bridge.sendToL2(networkSlugToId(destNetwork), recipient, value)
  }

  async addLiquidity (
    network: string,
    token: string,
    token0Amount: string | number
  ) {
    const token1Rate = await this.calcToken1Rate(network, token)
    const token1Amount = Number(token0Amount) * Number(token1Rate)

    const uniswapRouter = this.getUniswapRouterContract(network, token)
    const uniswapRouterAddress = uniswapRouter.address
    const tokenContract = this.getTokenContract(network, token)
    const hTokenContract = this.getHopBridgeTokenContract(network, token)

    let allowance = await this.getAllowance(
      network,
      token,
      uniswapRouterAddress
    )
    if (allowance < 1000) {
      const tx = await this.approve(network, token, uniswapRouterAddress)
      await tx?.wait()
    }

    allowance = await this.getAllowance(
      network,
      hTokenContract,
      uniswapRouterAddress
    )
    if (allowance < 1000) {
      const tx = await this.approve(
        network,
        hTokenContract,
        uniswapRouterAddress
      )
      await tx?.wait()
    }

    const token0 = tokenContract.address
    const token1 = hTokenContract.address
    const amount0Desired = parseUnits(token0Amount.toString(), 18)
    const amount1Desired = parseUnits(token1Amount.toString(), 18)
    const amount0Min = 0
    const amount1Min = 0
    const recipient = await this.getAddress()
    const deadline = (Date.now() / 1000 + 5 * 60) | 0

    return uniswapRouter.addLiquidity(
      token0,
      token1,
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      recipient,
      deadline
    )
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
    await tx?.wait()
  }
  allowance = await user.getAllowance(network, token, spender)
  expect(allowance > 0).toBe(true)
}
