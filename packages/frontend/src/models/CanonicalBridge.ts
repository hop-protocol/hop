import { Signer, ethers, BigNumber, BigNumberish, utils } from 'ethers'
import {
  ArbitrumInbox__factory,
  ArbitrumInbox,
  L1ArbitrumDaiGateway__factory,
  L1ArbitrumDaiGateway,
  L1OptimismDaiTokenBridge__factory,
  L1OptimismTokenBridge__factory,
  L1OptimismTokenBridge,
  L1PolygonPlasmaBridgeDepositManager__factory,
  L1PolygonPlasmaBridgeDepositManager,
  L1PolygonPosRootChainManager__factory,
  L1PolygonPosRootChainManager,
  L1XDaiForeignOmniBridge__factory,
  L1XDaiForeignOmniBridge,
  L1XDaiPoaBridge__factory,
  L1XDaiPoaBridge,
  L1XDaiWETHOmnibridgeRouter__factory,
  L1XDaiWETHOmnibridgeRouter,
} from '@hop-protocol/core/contracts'
import { ChainSlug, CanonicalToken } from '@hop-protocol/sdk'
import Base, { L1Factory } from '@hop-protocol/sdk/dist/src/Base'
import { metadata } from '@hop-protocol/sdk/dist/src/config'
import { TokenSymbol } from '@hop-protocol/sdk/dist/src/constants'
import { Chain } from '@hop-protocol/sdk/dist/src/models'
import Token from '@hop-protocol/sdk/dist/src/models/Token'
import TokenClass from '@hop-protocol/sdk/dist/src/Token'
import { TChain, TToken } from '@hop-protocol/sdk/dist/src/types'
import { Bridge } from 'arb-ts'
import { JsonRpcSigner } from '@ethersproject/providers'

export type L1CanonicalBridge =
  | ArbitrumInbox
  | L1OptimismTokenBridge
  | L1PolygonPlasmaBridgeDepositManager
  | L1PolygonPosRootChainManager
  | L1XDaiForeignOmniBridge
  | L1XDaiPoaBridge
  | L1XDaiWETHOmnibridgeRouter

class CanonicalBridge extends Base {
  public chain: Chain
  public tokenSymbol: TokenSymbol
  address: string
  l2TokenAddress: string

  constructor(network: string, signer: Signer, token: TToken, chain: TChain) {
    super(network, signer)
    if (!token) {
      throw new Error('token symbol is required')
    }
    this.getSignerOrProvider(Chain.Ethereum, signer).then(s => {
      this.signer = s
    })
    this.chain = this.toChainModel(chain)
    this.tokenSymbol = this.toTokenModel(token).symbol
    this.address = this.getL1CanonicalBridgeAddress(this.tokenSymbol, this.chain)
    this.l2TokenAddress = this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
  }

  public connect(signer: Signer) {
    return new CanonicalBridge(this.network, signer, this.tokenSymbol, this.chain)
  }

  public getL1CanonicalAllowance(): Promise<BigNumber> {
    const l1CanonicalToken = this.getL1Token().connect(this.signer)
    const spender = this.getDepositApprovalAddress()
    if (!spender) {
      throw new Error(`token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`)
    }
    return l1CanonicalToken.allowance(spender)
  }

  public getDepositApprovalAddress(): string {
    if (this.chain.equals(Chain.Polygon) && this.tokenSymbol !== Token.MATIC) {
      return this.getL1PosErc20PredicateAddress(this.tokenSymbol, this.chain)
    }

    if (this.chain.equals(Chain.Arbitrum) && this.tokenSymbol !== Token.ETH) {
      return this.getL1ArbitrumGateway(this.tokenSymbol)
    }

    return this.address
  }

  public async estimateApproveTx(amount: BigNumberish) {
    const l1CanonicalToken = this.getL1Token().connect(this.signer)
    const spender = this.getDepositApprovalAddress()
    const populatedTx = await l1CanonicalToken.populateApproveTx(spender, amount)
    return this.signer.estimateGas(populatedTx)
  }

  public async approve(amount: BigNumberish) {
    amount = amount.toString()
    const l1CanonicalToken = this.getL1Token().connect(this.signer)

    const spender = this.getDepositApprovalAddress()
    if (!spender) {
      throw new Error(`token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`)
    }
    return l1CanonicalToken.approve(spender, amount)
  }

  public async estimateDepositTx(amount: BigNumberish) {
    const populatedTx = await this.populateDepositTx(amount)
    return this.signer.estimateGas(populatedTx)
  }

  public async deposit(amount: BigNumberish, customRecipient?: string) {
    if (this.chain.equals(Chain.Arbitrum) && this.tokenSymbol !== CanonicalToken.ETH) {
      return this.populateDepositTx(amount, customRecipient)
    }
    const populatedTx = await this.populateDepositTx(amount)
    return this.signer.sendTransaction(populatedTx)
  }

  public async populateDepositTx(amount: BigNumberish, customRecipient?: string): Promise<any> {
    amount = amount.toString()
    const signerAddress = await this.getSignerAddress()
    const from = signerAddress
    const recipient = customRecipient || signerAddress
    const l1CanonicalBridge = await this.getL1CanonicalBridge()
    const l1CanonicalToken = this.getL1Token()
    const coder = ethers.utils.defaultAbiCoder
    const payload = coder.encode(['uint256'], [amount])

    switch (this.chain.slug) {
      case ChainSlug.Gnosis: {
        if (this.tokenSymbol === Token.DAI) {
          return (l1CanonicalBridge as L1XDaiPoaBridge).populateTransaction.relayTokens(
            recipient,
            amount,
            {
              // Gnosis requires a higher gas limit
              gasLimit: 500e3,
              from,
            }
          )
        }

        if (this.tokenSymbol === Token.ETH) {
          return (l1CanonicalBridge as L1XDaiWETHOmnibridgeRouter).populateTransaction[
            'wrapAndRelayTokens(address,bytes)'
          ](recipient, payload, {
            // Gnosis requires a higher gas limit
            gasLimit: 500e3,
            from,
          })
        }

        return (l1CanonicalBridge as L1XDaiForeignOmniBridge).populateTransaction.relayTokens(
          l1CanonicalToken.address,
          recipient,
          amount,
          {
            // Gnosis requires a higher gas limit
            gasLimit: 500e3,
            from,
          }
        )
      }

      case ChainSlug.Optimism: {
        const l2TokenAddress = this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
        if (!l2TokenAddress) {
          throw new Error(
            `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
          )
        }

        if (this.tokenSymbol === Token.DAI) {
          const bridge = L1OptimismDaiTokenBridge__factory.connect(
            l1CanonicalBridge.address,
            this.signer
          )
          return bridge.populateTransaction.depositERC20(
            l1CanonicalToken.address,
            l2TokenAddress,
            amount,
            BigNumber.from('1920000'),
            '0x',
            {
              from,
              gasLimit: 500e3,
            }
          )
        }

        const bridge = L1OptimismTokenBridge__factory.connect(
          l1CanonicalBridge.address,
          this.signer
        )
        return bridge.populateTransaction.deposit(
          l1CanonicalToken.address,
          l2TokenAddress,
          signerAddress,
          payload,
          { from, gasLimit: 500e3 }
        )
      }

      case ChainSlug.Arbitrum: {
        const ethSigner = await this.getSignerOrProvider(Chain.Ethereum, this.signer)
        const arbProvider = await this.getSignerOrProvider(Chain.Arbitrum)
        const arbSigner = (arbProvider as any).getUncheckedSigner(from)
        const arbBridge = await Bridge.init(ethSigner as JsonRpcSigner, arbSigner)

        let bridge: ArbitrumInbox | L1ArbitrumDaiGateway = L1ArbitrumDaiGateway__factory.connect(
          l1CanonicalBridge.address,
          this.signer
        )

        if (this.tokenSymbol === Token.ETH) {
          bridge = await this.getContract(
            ArbitrumInbox__factory,
            l1CanonicalBridge.address,
            this.signer
          )
          const maxSubmissionCost = BigNumber.from(amount).add(1000e4)
          return ((bridge as ArbitrumInbox).populateTransaction.depositEth as any)(
            BigNumber.from(maxSubmissionCost),
            {
              value: amount,
              from,
            }
          )
        }

        const depositInputParams = {
          erc20L1Address: l1CanonicalToken.address,
          amount: BigNumber.from(amount),
          destinationAddress: recipient,
        }
        const depositTxParams = await arbBridge.getDepositTxParams(depositInputParams)
        const gasNeeded = await arbBridge.estimateGasDeposit(depositTxParams)
        const { maxFeePerGas, gasPrice } = await arbBridge.l1Provider.getFeeData()
        const price = maxFeePerGas || gasPrice
        const walletBal = await arbBridge.l1Provider.getBalance(from)

        if (!price) {
          console.log('Warning: could not get gas price estimate; will try depositing anyway')
        } else {
          const fee = price.mul(gasNeeded)
          if (fee.gt(walletBal)) {
            console.log(
              `An estimated ${utils.formatEther(
                fee
              )} ether is needed for deposit; you only have ${utils.formatEther(
                walletBal
              )} ether. Will try depositing anyway:`
            )
          }
        }

        return arbBridge.l1Bridge.deposit(depositTxParams)
      }
      case ChainSlug.Polygon: {
        if (this.tokenSymbol === Token.MATIC) {
          return (
            l1CanonicalBridge as L1PolygonPlasmaBridgeDepositManager
          ).populateTransaction.depositERC20ForUser(
            l1CanonicalToken.address,
            signerAddress,
            payload,
            {
              from,
            }
          )
        }

        if (this.tokenSymbol === Token.ETH) {
          return (
            l1CanonicalBridge as L1PolygonPosRootChainManager
          ).populateTransaction.depositEtherFor(signerAddress, { from, value: amount })
        }

        return (l1CanonicalBridge as L1PolygonPosRootChainManager).populateTransaction.depositFor(
          signerAddress,
          l1CanonicalToken.address,
          payload,
          { from }
        )
      }
    }
  }

  async getL1CanonicalBridge(): Promise<L1CanonicalBridge> {
    let factory: L1Factory

    if (this.chain.equals(Chain.Gnosis)) {
      if (this.tokenSymbol === Token.DAI) {
        factory = L1XDaiPoaBridge__factory
      } else if (this.tokenSymbol === Token.ETH) {
        factory = L1XDaiWETHOmnibridgeRouter__factory
      } else {
        factory = L1XDaiForeignOmniBridge__factory
      }
    } else if (this.chain.equals(Chain.Optimism)) {
      if (this.tokenSymbol === Token.DAI) {
        factory = L1OptimismDaiTokenBridge__factory
      }
      factory = L1OptimismTokenBridge__factory
    } else if (this.chain.equals(Chain.Arbitrum)) {
      if (this.tokenSymbol === Token.ETH) {
        factory = ArbitrumInbox__factory
      } else {
        factory = L1ArbitrumDaiGateway__factory
      }
    } else {
      if (this.tokenSymbol === Token.MATIC) {
        factory = L1PolygonPlasmaBridgeDepositManager__factory
      } else {
        factory = L1PolygonPosRootChainManager__factory
      }
    }

    return (factory as any).connect(this.address, this.signer)
  }

  public getL1Token() {
    return this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
  }

  public toCanonicalToken(token: TToken, network: string, chain: TChain) {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, symbol, decimals, image } = metadata.tokens[network][token.canonicalSymbol]
    let address
    if (chain.isL1) {
      const l1CanonicalToken = this.getL1CanonicalTokenAddress(token.symbol, chain.slug)
      address = l1CanonicalToken
    } else {
      const l2CanonicalToken = this.getL2CanonicalTokenAddress(token.symbol, chain.slug)
      address = l2CanonicalToken
    }

    return new TokenClass(network, chain, address, decimals, symbol, name, image)
  }
}

export default CanonicalBridge
