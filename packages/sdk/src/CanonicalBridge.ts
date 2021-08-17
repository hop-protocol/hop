import { Signer, Contract, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import {
  arbErc20Abi,
  l1xDaiForeignOmniBridgeAbi,
  l1HomeAmbNativeToErc20,
  l1OptimismTokenBridgeAbi,
  arbitrumGlobalInboxAbi,
  l2OptimismTokenBridgeAbi,
  l2xDaiTokenAbi,
  l1PolygonPosRootChainManagerAbi,
  l2PolygonChildErc20Abi
} from '@hop-protocol/core/abi'
import { Chain } from './models'
import { TChain, TToken, TAmount, TProvider } from './types'
import { metadata } from './config'
import Token from './models/Token'
import TokenClass from './Token'
import Base from './Base'

/**
 * Class reprensenting Canonical Token Bridge.
 * @namespace CanonicalBridge
 */
class CanonicalBridge extends Base {
  /** Chain model */
  public chain: Chain

  /** Token class instance */
  // public token: TokenClass

  public tokenSymbol: string

  /**
   * @desc Instantiates Canonical Token Bridge.
   * Returns a new Canonical Token Bridge instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @param {Object} token - Token symbol or model
   * @param {Object} chain - Chain model
   * @returns {Object} CanonicalBridge SDK instance.
   * @example
   *```js
   *import { CanonicalHop, Chain, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new CanonicalBridge('kovan', signer, Token.USDC, Chain.Optimism)
   *```
   */
  constructor (
    network: string,
    signer: TProvider,
    token: TToken,
    chain: TChain
  ) {
    super(network, signer)
    if (!token) {
      throw new Error('token symbol is required')
    }
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    if (signer) {
      this.signer = signer
    }
    this.chain = chain

    if (token instanceof Token) {
      this.tokenSymbol = token.symbol
    } else if (typeof token === 'string') {
      this.tokenSymbol = token
    } else {
      console.log('token: ', token)
      throw new Error('Invalid token')
    }
  }

  /**
   * @desc Return address of L1 canonical token bridge.
   * @return {String} L1 canonical token bridge address
   */
  public get address () {
    if (!this.tokenSymbol) {
      return null
    }
    if (!this.chain) {
      return null
    }
    return this.getL1CanonicalBridgeAddress(this.tokenSymbol, this.chain)
  }

  /**
   * @desc Returns canonical bridge instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New CanonicalBridge SDK instance with connected signer.
   */
  public connect (signer: TProvider) {
    return new CanonicalBridge(
      this.network,
      signer,
      this.tokenSymbol,
      this.chain
    )
  }

  public getDepositApprovalAddress (chain?: TChain): string {
    chain = this.chain || this.toChainModel(chain)
    let spender = this.getL1CanonicalBridgeAddress(this.tokenSymbol, chain)
    if (chain.equals(Chain.Polygon)) {
      spender = this.getL1PosErc20PredicateAddress(this.tokenSymbol, chain)
    }
    return spender
  }

  /**
   * @desc Sends transaction to approve tokens for canonical token bridge deposit.
   * Will only send approval transaction if necessary.
   * @param {Object} amount - Token amount to approve.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers transaction object.
   */
  public async approveDeposit (amount: TAmount, chain?: TChain) {
    amount = amount.toString()
    if (chain) {
      chain = this.toChainModel(chain)
    } else {
      chain = this.chain
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum)

    const l1CanonicalToken = this.getL1Token().connect(provider)

    const spender = this.getDepositApprovalAddress(chain)
    if (!spender) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    return l1CanonicalToken.approve(spender, amount)
  }

  /**
   * @desc Sends transaction to canonical token bridge to deposit tokens into L2.
   * @param {Object} amount - Token amount to deposit.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers transaction object.
   */
  public async deposit (amount: TAmount, chain?: TChain) {
    amount = amount.toString()
    if (chain) {
      chain = this.toChainModel(chain)
    } else {
      chain = this.chain
    }
    if (!chain) {
      throw new Error('chain is required')
    }

    const recipient = await this.getSignerAddress()
    const bridgeAddress = this.getL1CanonicalBridgeAddress(
      this.tokenSymbol,
      chain
    )
    if (!bridgeAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum)
    const tokenAddress = this.getL1CanonicalTokenAddress(
      this.tokenSymbol,
      Chain.Ethereum
    )
    if (!tokenAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }

    if ((chain as Chain).equals(Chain.xDai)) {
      const bridge = await this.getContract(
        bridgeAddress,
        l1xDaiForeignOmniBridgeAbi,
        provider
      )
      //await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.relayTokens(tokenAddress, recipient, amount, {
        // xDai requires a higher gas limit
        gasLimit: 300000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const l2TokenAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!l2TokenAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = await this.getContract(
        bridgeAddress,
        l1OptimismTokenBridgeAbi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.deposit(tokenAddress, l2TokenAddress, recipient, amount)
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const arbChain = this.getArbChainAddress(this.tokenSymbol, chain)
      const bridge = await this.getContract(
        bridgeAddress,
        arbitrumGlobalInboxAbi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.depositERC20Message(
        arbChain,
        tokenAddress,
        recipient,
        amount
      )
    } else if ((chain as Chain).equals(Chain.Polygon)) {
      const bridgeAddress = this.getL1PosRootChainManagerAddress(
        this.tokenSymbol,
        chain
      )
      if (!bridgeAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = await this.getContract(
        bridgeAddress,
        l1PolygonPosRootChainManagerAbi,
        provider
      )
      const coder = ethers.utils.defaultAbiCoder
      const payload = coder.encode(['uint256'], [amount])
      return bridge.depositFor(recipient, tokenAddress, payload)
    } else {
      throw new Error('not implemented')
    }
  }

  public getWithdrawApprovalAddress (chain?: TChain): string {
    chain = this.chain || this.toChainModel(chain)
    let spender = this.getL2CanonicalBridgeAddress(this.tokenSymbol, chain)
    if (chain.equals(Chain.Polygon)) {
      spender = this.getL1PosErc20PredicateAddress(this.tokenSymbol, chain)
    }
    return spender
  }

  /**
   * @desc Sends transaction to approve tokens for canonical token bridge withdrawal.
   * Will only send approval transaction if necessary.
   * @param {Object} amount - Token amount to approve.
   * @returns {Object} Ethers transaction object.
   */
  public async approveWithdraw (amount: TAmount) {
    amount = amount.toString()
    // no approval needed
    if (this.chain.equals(Chain.Polygon)) {
      return
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum)
    const token = this.getCanonicalToken(this.chain).connect(provider)
    const spender = this.getWithdrawApprovalAddress(this.chain)
    if (!spender) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
      )
    }
    return token.approve(spender, amount)
  }

  /**
   * @desc Sends transaction to L2 canonical token bridge to withdraw tokens into L1.
   * @param {Object} amount - Token amount to withdraw.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers transaction object.
   */
  public async withdraw (amount: TAmount, chain?: TChain) {
    amount = amount.toString()
    if (chain) {
      chain = this.toChainModel(chain)
    } else {
      chain = this.chain
    }
    if (!chain) {
      throw new Error('chain is required')
    }

    const recipient = await this.getSignerAddress()
    const provider = await this.getSignerOrProvider(chain)
    if ((chain as Chain).equals(Chain.xDai)) {
      const bridgeAddress = this.getL2CanonicalBridgeAddress(
        this.tokenSymbol,
        chain
      )
      if (!bridgeAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const tokenAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!tokenAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = await this.getContract(
        tokenAddress,
        l2xDaiTokenAbi,
        provider
      )
      return bridge.transferAndCall(bridgeAddress, amount, '0x', {
        // xDai requires a higher gas limit
        gasLimit: 400000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const bridgeAddress = this.getL2CanonicalBridgeAddress(
        this.tokenSymbol,
        chain
      )
      if (!bridgeAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const l1TokenAddress = this.getL1CanonicalTokenAddress(
        this.tokenSymbol,
        Chain.Ethereum
      )
      if (!l1TokenAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${Chain.Ethereum.slug}" is unsupported`
        )
      }
      const tokenAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!tokenAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = await this.getContract(
        bridgeAddress,
        l2OptimismTokenBridgeAbi,
        provider
      )

      return bridge.withdraw(l1TokenAddress, tokenAddress, amount, {
        // optimism requires a high gas limit and 0 gas price
        gasLimit: 1000000,
        gasPrice: 0
      })
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const bridgeAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!bridgeAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = await this.getContract(
        bridgeAddress,
        arbErc20Abi,
        provider
      )
      return bridge.withdraw(recipient, amount)
    } else if ((chain as Chain).equals(Chain.Polygon)) {
      const tokenAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!tokenAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const token = await this.getContract(
        tokenAddress,
        l2PolygonChildErc20Abi,
        provider
      )
      return token.withdraw(amount)
    } else {
      throw new Error('not implemented')
    }
  }

  /**
   * @desc Sends transaction to finalize withdrawal.
   * This call is necessary on Polygon to finalize L2 withdrawal into L1 on
   * certain chains. Will only send transaction if necessary.
   * @param {String} txHash - Transaction hash proving token burn on L2.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers transaction object.
   */
  public async exit (txHash: string, chain: TChain) {
    chain = this.toChainModel(chain)
    const recipient = await this.getSignerAddress()
    const { MaticPOSClient } = require('@maticnetwork/maticjs')
    const Web3 = require('web3')

    const posRootChainManagerAddress = this.getL1PosRootChainManagerAddress(
      this.tokenSymbol,
      chain
    )
    if (!posRootChainManagerAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }

    const posERC20PredicateAddress = this.getL1PosErc20PredicateAddress(
      this.tokenSymbol,
      chain
    )
    if (!posERC20PredicateAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }

    const maticPOSClient = new MaticPOSClient({
      network: Chain.Ethereum.chainId === 1 ? 'mainnet' : 'testnet',
      maticProvider: new Web3.providers.HttpProvider(Chain.Polygon.rpcUrl),
      parentProvider: new Web3.providers.HttpProvider(Chain.Ethereum.rpcUrl),
      posRootChainManager: posRootChainManagerAddress,
      posERC20Predicate: posERC20PredicateAddress
    })

    const tx = await maticPOSClient.exitERC20(txHash, {
      from: recipient,
      encodeAbi: true
    })

    const provider = await this.getSignerOrProvider(chain)
    return (provider as Signer).sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  /**
   * @desc Checks if the amount of tokens is allowed by the canonical token bridge,
   * otherwise throw an error.
   * @param {Object} chain - Chain model.
   * @param {Object} canonicalBridge - Ethers contract object for canonical token bridge.
   * @param {Object} amount - Token amount.
   */
  private async checkMaxTokensAllowed (
    chain: Chain,
    canonicalBridge: Contract,
    amount: TAmount
  ) {
    if (chain.equals(Chain.xDai)) {
      const l1CanonicalToken = this.getL1Token()

      const maxPerTx = await canonicalBridge?.maxPerTx()
      const formattedMaxPerTx = Number(
        formatUnits(maxPerTx.toString(), l1CanonicalToken.decimals)
      )
      const formattedAmount = Number(
        formatUnits(amount.toString(), l1CanonicalToken.decimals)
      )
      if (formattedAmount > formattedMaxPerTx) {
        throw new Error(
          `Max allowed by xDai Bridge is ${formattedMaxPerTx} tokens`
        )
      }
    }
  }

  // xDai AMB bridge
  async getAmbBridge (chain?: TChain) {
    chain = this.toChainModel(chain || this.chain)
    if (chain.equals(Chain.Ethereum)) {
      const address = this.getL1AmbBridgeAddress(this.tokenSymbol, Chain.xDai)
      const provider = await this.getSignerOrProvider(Chain.Ethereum)
      return this.getContract(address, l1HomeAmbNativeToErc20, provider)
    }
    const address = this.getL2AmbBridgeAddress(this.tokenSymbol, Chain.xDai)
    const provider = await this.getSignerOrProvider(Chain.xDai)
    return this.getContract(address, l1HomeAmbNativeToErc20, provider)
  }

  async getL2CanonicalBridge () {
    const address = this.getL2CanonicalBridgeAddress(
      this.tokenSymbol,
      this.chain
    )
    if (!address) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(this.chain)
    let abi: any[]
    if (this.chain.equals(Chain.Polygon)) {
      abi = l2PolygonChildErc20Abi
    } else if (this.chain.equals(Chain.xDai)) {
      abi = l2xDaiTokenAbi
    } else if (this.chain.equals(Chain.Arbitrum)) {
      abi = arbErc20Abi
    } else if (this.chain.equals(Chain.Optimism)) {
      abi = l2OptimismTokenBridgeAbi
    }
    return this.getContract(address, abi, provider)
  }

  async getL1CanonicalBridge () {
    const address = this.getL1CanonicalBridgeAddress(
      this.tokenSymbol,
      this.chain
    )
    if (!address) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum)
    let abi: any[]
    if (this.chain.equals(Chain.Polygon)) {
      abi = l1PolygonPosRootChainManagerAbi
    } else if (this.chain.equals(Chain.xDai)) {
      abi = l1xDaiForeignOmniBridgeAbi
    } else if (this.chain.equals(Chain.Arbitrum)) {
      abi = arbitrumGlobalInboxAbi
    } else if (this.chain.equals(Chain.Optimism)) {
      abi = l1OptimismTokenBridgeAbi
    }
    return this.getContract(address, abi, provider)
  }

  // ToDo: Remove duplicated logic after refactoring token getters
  public getL1Token () {
    return this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
  }

  public getCanonicalToken (chain: TChain) {
    return this.toCanonicalToken(this.tokenSymbol, this.network, chain)
  }

  public getL2HopToken (chain: TChain) {
    return this.toHopToken(this.tokenSymbol, this.network, chain)
  }

  public toCanonicalToken (token: TToken, network: string, chain: TChain) {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, symbol, decimals, image } = metadata.tokens[network][
      token.canonicalSymbol
    ]
    let address
    if (chain.isL1) {
      const { l1CanonicalToken } = this.getL1CanonicalBridgeAddress(
        token.symbol,
        chain.slug
      )
      address = l1CanonicalToken
    } else {
      const { l2CanonicalToken } = this.getL2CanonicalTokenAddress(
        token.symbol,
        chain.slug
      )
      address = l2CanonicalToken
    }

    return new TokenClass(
      network,
      chain,
      address,
      decimals,
      symbol,
      name,
      image
    )
  }

  public toHopToken (token: TToken, network: string, chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain.isL1) {
      throw new Error('Hop tokens do not exist on layer 1')
    }

    let tokenSymbol
    if (typeof token === 'string') {
      tokenSymbol = token
    } else {
      tokenSymbol = token.symbol
    }
    const { name, symbol, decimals, image } = metadata.tokens[network][
      tokenSymbol
    ]
    const { l2HopBridgeToken } = this.getL2HopBridgeTokenAddress(
      tokenSymbol,
      chain.slug
    )

    return new TokenClass(
      network,
      chain,
      l2HopBridgeToken,
      decimals,
      symbol,
      name,
      image
    )
  }
}

export default CanonicalBridge
