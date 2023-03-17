import Base, { BaseConstructorOptions, ChainProviders, L1Factory, L2Factory } from './Base'
import Token from './models/Token'
import TokenClass from './Token'
import { ArbERC20__factory } from '@hop-protocol/core/contracts/factories/static/ArbERC20__factory'
import { ArbitrumGlobalInbox__factory } from '@hop-protocol/core/contracts/factories/static/ArbitrumGlobalInbox__factory'
import { Chain } from './models'
import { Contract, Signer, ethers } from 'ethers'
import { L1_HomeAMBNativeToErc20__factory } from '@hop-protocol/core/contracts/factories/static/L1_HomeAMBNativeToErc20__factory'
import { L1_OptimismTokenBridge__factory } from '@hop-protocol/core/contracts/factories/static/L1_OptimismTokenBridge__factory'
import { L1_PolygonPosRootChainManager__factory } from '@hop-protocol/core/contracts/factories/static/L1_PolygonPosRootChainManager__factory'
import { L1_xDaiForeignOmniBridge__factory } from '@hop-protocol/core/contracts/factories/static/L1_xDaiForeignOmniBridge__factory'
import { L2_OptimismTokenBridge__factory } from '@hop-protocol/core/contracts/factories/static/L2_OptimismTokenBridge__factory'
import { L2_PolygonChildERC20__factory } from '@hop-protocol/core/contracts/factories/static/L2_PolygonChildERC20__factory'
import { L2_xDaiToken__factory } from '@hop-protocol/core/contracts/factories/static/L2_xDaiToken__factory'
import { TAmount, TChain, TProvider, TToken } from './types'
import { TokenSymbol } from './constants'
import { formatUnits } from 'ethers/lib/utils'
import { metadata } from './config'

export type CanonicalBridgeConstructorOptions = {
  token?: TToken,
  chain?: TChain,
} & BaseConstructorOptions

/**
 * Class reprensenting Canonical Token Bridge.
 * @namespace CanonicalBridge
 */
class CanonicalBridge extends Base {
  /** Chain model */
  public chain: Chain

  /** Token class instance */
  // public token: TokenClass

  public tokenSymbol: TokenSymbol

  /**
   * @desc Instantiates Canonical Token Bridge.
   * Returns a new Canonical Token Bridge instance.
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param signer - Ethers `Signer` for signing transactions.
   * @param token - Token symbol or model
   * @param chain - Chain model
   * @returns CanonicalBridge SDK instance.
   * @example
   *```js
   *import { CanonicalHop, Chain } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new CanonicalBridge('kovan', signer, 'USDC', Chain.Optimism)
   *```
   */
  constructor (
    networkOrOptionsObject: string | CanonicalBridgeConstructorOptions,
    signer?: TProvider,
    token?: TToken,
    chain?: TChain,
    chainProviders?: ChainProviders
  ) {
    super(networkOrOptionsObject, signer, chainProviders)

    if (networkOrOptionsObject instanceof Object) {
      const options = networkOrOptionsObject as CanonicalBridgeConstructorOptions
      if (signer || token || chain || chainProviders) {
        throw new Error('expected only single options parameter')
      }
      signer = options.signer
      token = options.token
      chain = options.chain
    }

    if (!token) {
      throw new Error('token symbol is required')
    }
    if (!chain) {
      throw new Error('chain is required')
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
   * @return L1 canonical token bridge address
   */
  public get address (): string {
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
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns New CanonicalBridge SDK instance with connected signer.
   */
  public connect (signer: TProvider): CanonicalBridge {
    return new CanonicalBridge({
      network: this.network,
      signer,
      token: this.tokenSymbol,
      chain: this.chain,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled
    })
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
   * @param amount - Token amount to approve.
   * @param chain - Chain model.
   * @returns Ethers transaction object.
   */
  public async approveDeposit (amount: TAmount, chain?: TChain): Promise<any> {
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
   * @param amount - Token amount to deposit.
   * @param chain - Chain model.
   * @returns Ethers transaction object.
   */
  public async deposit (amount: TAmount, chain?: TChain): Promise<any> {
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

    if ((chain as Chain).equals(Chain.Gnosis)) {
      const bridge = await this.getContract(
        L1_xDaiForeignOmniBridge__factory,
        bridgeAddress,
        provider
      )
      // await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.relayTokens(tokenAddress, recipient, amount, {
        // Gnosis requires a higher gas limit
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
        L1_OptimismTokenBridge__factory,
        bridgeAddress,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.deposit(tokenAddress, l2TokenAddress, recipient, amount)
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const arbChain = this.getArbChainAddress(this.tokenSymbol, chain)
      const bridge = await this.getContract(
        ArbitrumGlobalInbox__factory,
        bridgeAddress,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, amount)
      return bridge.depositERC20Message(
        arbChain,
        tokenAddress,
        recipient,
        amount
      )
    } else if ((chain as Chain).equals(Chain.Nova)) {
      const arbChain = this.getArbChainAddress(this.tokenSymbol, chain)
      const bridge = await this.getContract(
        ArbitrumGlobalInbox__factory,
        bridgeAddress,
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
        L1_PolygonPosRootChainManager__factory,
        bridgeAddress,
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
   * @param amount - Token amount to approve.
   * @returns Ethers transaction object.
   */
  public async approveWithdraw (amount: TAmount): Promise<any> {
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
   * @param amount - Token amount to withdraw.
   * @param chain - Chain model.
   * @returns Ethers transaction object.
   */
  public async withdraw (amount: TAmount, chain?: TChain): Promise<any> {
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
    if ((chain as Chain).equals(Chain.Gnosis)) {
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
        L2_xDaiToken__factory,
        tokenAddress,
        provider
      )
      return bridge.transferAndCall(bridgeAddress, amount, '0x', {
        // Gnosis requires a higher gas limit
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
        L2_OptimismTokenBridge__factory,
        bridgeAddress,
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
      const bridge = ArbERC20__factory.connect(bridgeAddress, provider)
      return bridge.withdraw(recipient, amount)
    } else if ((chain as Chain).equals(Chain.Nova)) {
      const bridgeAddress = this.getL2CanonicalTokenAddress(
        this.tokenSymbol,
        chain
      )
      if (!bridgeAddress) {
        throw new Error(
          `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
        )
      }
      const bridge = ArbERC20__factory.connect(bridgeAddress, provider)
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
      const token = L2_PolygonChildERC20__factory.connect(tokenAddress, provider)
      return token.withdraw(amount)
    } else {
      throw new Error('not implemented')
    }
  }

  /**
   * @desc Sends transaction to finalize withdrawal.
   * This call is necessary on Polygon to finalize L2 withdrawal into L1 on
   * certain chains. Will only send transaction if necessary.
   * @param txHash - Transaction hash proving token burn on L2.
   * @param chain - Chain model.
   * @returns Ethers transaction object.
   */
  public async exit (txHash: string, chain: TChain): Promise<any> {
    chain = this.toChainModel(chain)
    const recipient = await this.getSignerAddress()
    const { MaticPOSClient } = require('@maticnetwork/maticjs')
    const Web3 = require('web3')

    const maticPOSClient = new MaticPOSClient({
      network: Chain.Ethereum.chainId === 1 ? 'mainnet' : 'testnet',
      maticProvider: new Web3.providers.HttpProvider(Chain.Polygon.rpcUrl),
      parentProvider: new Web3.providers.HttpProvider(Chain.Ethereum.rpcUrl)
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
   * @param chain - Chain model.
   * @param canonicalBridge - Ethers contract object for canonical token bridge.
   * @param amount - Token amount.
   */
  private async checkMaxTokensAllowed (
    chain: Chain,
    canonicalBridge: Contract,
    amount: TAmount
  ): Promise<void> {
    if (chain.equals(Chain.Gnosis)) {
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
          `Max allowed by Gnosis Bridge is ${formattedMaxPerTx} tokens`
        )
      }
    }
  }

  // Gnosis AMB bridge
  async getAmbBridge (chain?: TChain): Promise<any> {
    chain = this.toChainModel(chain || this.chain)
    if (chain.equals(Chain.Ethereum)) {
      const address = this.getL1AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
      const provider = await this.getSignerOrProvider(Chain.Ethereum)
      return this.getContract(L1_HomeAMBNativeToErc20__factory, address, provider)
    }
    const address = this.getL2AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
    const provider = await this.getSignerOrProvider(Chain.Gnosis)
    return this.getContract(L1_HomeAMBNativeToErc20__factory, address, provider)
  }

  async getL2CanonicalBridge (): Promise<any> {
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
    let factory: L2Factory
    if (this.chain.equals(Chain.Polygon)) {
      factory = L2_PolygonChildERC20__factory
    } else if (this.chain.equals(Chain.Gnosis)) {
      factory = L2_xDaiToken__factory
    } else if (this.chain.equals(Chain.Arbitrum)) {
      factory = ArbERC20__factory
    } else if (this.chain.equals(Chain.Nova)) {
      factory = ArbERC20__factory
    } else if (this.chain.equals(Chain.Optimism)) {
      factory = L2_OptimismTokenBridge__factory
    }
    return this.getContract(factory, address, provider)
  }

  async getL1CanonicalBridge (): Promise<any> {
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
    let factory: L1Factory
    if (this.chain.equals(Chain.Polygon)) {
      factory = L1_PolygonPosRootChainManager__factory
    } else if (this.chain.equals(Chain.Gnosis)) {
      factory = L1_xDaiForeignOmniBridge__factory
    } else if (this.chain.equals(Chain.Arbitrum)) {
      factory = ArbitrumGlobalInbox__factory
    } else if (this.chain.equals(Chain.Nova)) {
      factory = ArbitrumGlobalInbox__factory
    } else if (this.chain.equals(Chain.Optimism)) {
      factory = L1_OptimismTokenBridge__factory
    }
    return this.getContract(factory, address, provider)
  }

  public getL1Token (): any {
    return this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
  }

  public getCanonicalToken (chain: TChain): any {
    return this.toCanonicalToken(this.tokenSymbol, this.network, chain)
  }

  public getL2HopToken (chain: TChain): any {
    return this.toHopToken(this.tokenSymbol, this.network, chain)
  }

  public toCanonicalToken (token: TToken, network: string, chain: TChain): TokenClass {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, symbol, decimals, image } = metadata.tokens[network][
      token.canonicalSymbol
    ]
    let address
    if (chain.isL1) {
      const l1CanonicalToken = this.getL1CanonicalBridgeAddress(
        token.symbol,
        chain.slug
      )
      address = l1CanonicalToken
    } else {
      const l2CanonicalToken = this.getL2CanonicalTokenAddress(
        token.symbol,
        chain.slug
      )
      address = l2CanonicalToken
    }

    return new TokenClass({
      network,
      chain,
      address,
      decimals,
      symbol,
      name,
      image,
      signer: this.signer,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled
    })
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
    const l2HopBridgeToken = this.getL2HopBridgeTokenAddress(
      tokenSymbol,
      chain.slug
    )

    return new TokenClass({
      network,
      chain,
      address: l2HopBridgeToken,
      decimals,
      symbol,
      name,
      image,
      signer: this.signer,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled
    })
  }
}

export default CanonicalBridge
