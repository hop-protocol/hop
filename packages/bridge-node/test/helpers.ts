import { ethers, Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { tokens } from 'src/config'
import { arbitrumNetworkId } from 'src/constants'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2xDaiBridgeArtifact from 'src/abi/L2xDaiBridge.json'
import l2OptimismBridgeArtifact from 'src/abi/L2OptimismBridge.json'
import l2ArbitrumBridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import erc20Abi from 'src/abi/ERC20.json'
import { UINT256, KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import { getRpcUrl, networkSlugToId } from 'src/utils'

export class User {
  privateKey: string
  wallet: ethers.Wallet

  constructor (privateKey: string) {
    this.privateKey = privateKey
  }

  getProvider (network: string) {
    const url = getRpcUrl(network)
    return new ethers.providers.StaticJsonRpcProvider(url)
  }

  getWallet (network: string = KOVAN) {
    const provider = this.getProvider(network)
    return new ethers.Wallet(this.privateKey, provider)
  }

  async getBalance (network: string = KOVAN, token: string = '') {
    const address = await this.getAddress()
    if (!token) {
      const provider = this.getProvider(network)
      const balance = await provider.getBalance(address)
      return Number(formatUnits(balance, 18))
    }
    const contract = this.getTokenContract(network, token)
    const balance = await contract.balanceOf(address)
    return Number(formatUnits(balance, 18))
  }

  getTokenContract (network: string, token: string) {
    let tokenAddress = tokens[token][network].l2CanonicalToken
    if (network === KOVAN) {
      tokenAddress = tokens[token][network].l1CanonicalToken
    }
    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, erc20Abi, wallet)
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
    let tokenAddress = tokens[token][network].l2Bridge
    if (network === KOVAN) {
      tokenAddress = tokens[token][network].l1Bridge
    }

    let artifact: any = l1BridgeArtifact
    if (network === OPTIMISM) {
      artifact = l2OptimismBridgeArtifact
    } else if (network === XDAI) {
      artifact = l2xDaiBridgeArtifact
    } else if (network === ARBITRUM) {
      artifact = l2ArbitrumBridgeArtifact
    }

    const wallet = this.getWallet(network)
    return new Contract(tokenAddress, artifact.abi, wallet)
  }

  async approve (
    network: string,
    token: string,
    spender: string,
    amount?: string | number
  ) {
    const contract = this.getTokenContract(network, token)
    let approveAmount = UINT256
    if (amount) {
      approveAmount = parseUnits(amount.toString(), 18).toString()
    }
    return contract.approve(spender, approveAmount)
  }

  async getAllowance (network: string, token: string, spender: string) {
    const address = await this.getAddress()
    const contract = this.getTokenContract(network, token)
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
    return bridge.sendToL2AndAttemptSwap(
      chainId,
      recipient,
      parseUnits(amount.toString(), 18),
      amountOutMin,
      deadline
    )
  }

  async sendL2ToL1 (
    sourceNetwork: string,
    destNetwork: string,
    token: string,
    amount: string | number
  ) {
    const deadline = (Date.now() / 1000 + 300) | 0
    const chainId = networkSlugToId(destNetwork)
    const transferNonce = Date.now()
    const relayerFee = '0'
    const amountOutIn = '0'
    const destinationAmountOutMin = '0'
    const recipient = await this.getAddress()
    const bridge = this.getHopBridgeContract(sourceNetwork, token)

    return bridge.swapAndSend(
      chainId,
      recipient,
      parseUnits(amount.toString(), 18),
      transferNonce,
      relayerFee,
      amountOutIn,
      deadline,
      destinationAmountOutMin,
      deadline
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
    const transferNonce = Date.now()
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
      transferNonce,
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

  getBridgeAddress (network: string, token: string) {
    let address = tokens[token][network].l2Bridge
    if (network === KOVAN) {
      address = tokens[token][network].l1Bridge
    }
    return address
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
