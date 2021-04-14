import { providers, Signer, Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { addresses, chains, metadata } from './config'
import { MaxUint256 } from './constants'
import arbErc20Artifact from './abi/ArbERC20.json'
import l1xDaiForeignOmnibridge from './abi/L1_xDaiForeignOmnibridge.json'
import l1OptimismTokenBridgeArtifact from './abi/L1_OptimismTokenBridge.json'
import l1ArbitrumMessengerArtifact from './abi/GlobalInbox.json'
import l2OptimismTokenBridgeArtifact from './abi/L2_OptimismTokenBridge.json'
import l2xDaiTokenArtifact from './abi/L2_xDaiToken.json'
import { Chain, Token, Transfer } from './models'
import { TChain, TToken, TAmount } from './types'
import TokenClass from './Token'
import Base from './Base'

class CanonicalBridge extends Base {
  public signer: Signer
  public chain: Chain
  public token: TokenClass

  constructor (signer: Signer, token: TToken, chain?: TChain) {
    super()
    if (!token) {
      throw new Error('token symbol is required')
    }
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    if (signer) {
      this.signer = signer
    }
    if (chain) {
      this.chain = chain
    }

    this.token = new TokenClass(
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer
    )
  }

  connect (signer: Signer) {
    return new CanonicalBridge(signer, this.token, this.chain)
  }

  async deposit (tokenAmount: TAmount, chain?: TChain) {
    tokenAmount = tokenAmount.toString()
    if (chain) {
      chain = this.toChainModel(chain)
    } else {
      chain = this.chain
    }
    if (!chain) {
      throw new Error('chain is required')
    }

    const tokenSymbol = this.token.symbol
    const recipient = await this.getSignerAddress()
    const bridgeAddress =
      addresses.tokens[tokenSymbol][(chain as Chain).slug].l1CanonicalBridge
    const provider = await this.getSignerOrProvider(Chain.Kovan, this.signer)
    const tokenAddress =
      addresses.tokens[tokenSymbol][Chain.Kovan.slug].l1CanonicalToken

    const balance = await this.token.connect(provider).balanceOf(Chain.Kovan)
    console.log(balance)
    const tx = await this.token
      .connect(provider)
      .approve(Chain.Kovan, bridgeAddress)
    await tx?.wait()

    if ((chain as Chain).equals(Chain.xDai)) {
      const bridge = new Contract(
        bridgeAddress,
        l1xDaiForeignOmnibridge.abi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, tokenAmount)
      return bridge.relayTokens(tokenAddress, recipient, tokenAmount, {
        gasLimit: 1000000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const l2TokenAddress =
        addresses.tokens[tokenSymbol][(chain as Chain).slug].l2CanonicalToken
      const bridge = new Contract(
        bridgeAddress,
        l1OptimismTokenBridgeArtifact.abi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, tokenAmount)
      return bridge.deposit(
        tokenAddress,
        l2TokenAddress,
        recipient,
        tokenAmount
      )
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const arbChain = addresses.tokens[tokenSymbol][chain.slug].arbChain
      const bridge = new Contract(
        bridgeAddress,
        l1ArbitrumMessengerArtifact.abi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, tokenAmount)
      return bridge.depositERC20Message(
        arbChain,
        tokenAddress,
        recipient,
        tokenAmount
      )
    } else {
      throw new Error('not implemented')
    }
  }

  async withdraw (tokenAmount: TAmount, chain?: TChain) {
    tokenAmount = tokenAmount.toString()
    if (chain) {
      chain = this.toChainModel(chain)
    } else {
      chain = this.chain
    }
    if (!chain) {
      throw new Error('chain is required')
    }

    const tokenSymbol = this.token.symbol
    const recipient = await this.getSignerAddress()
    const provider = await this.getSignerOrProvider(chain, this.signer)
    if ((chain as Chain).equals(Chain.xDai)) {
      const bridgeAddress =
        addresses.tokens[tokenSymbol][(chain as Chain).slug].l2CanonicalBridge
      const tokenAddress =
        addresses.tokens[tokenSymbol][chain.slug].l2CanonicalToken

      const bridge = new Contract(
        tokenAddress,
        l2xDaiTokenArtifact.abi,
        provider
      )
      return bridge.transferAndCall(bridgeAddress, tokenAmount, '0x', {
        gasLimit: 1000000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const bridgeAddress =
        addresses.tokens[tokenSymbol][(chain as Chain).slug].l2CanonicalBridge
      const l1TokenAddress =
        addresses.tokens[tokenSymbol][Chain.Kovan.slug].l1CanonicalToken
      const tokenAddress =
        addresses.tokens[tokenSymbol][chain.slug].l2CanonicalToken
      const bridge = new Contract(
        bridgeAddress,
        l2OptimismTokenBridgeArtifact.abi,
        provider
      )

      const balance = await this.token.connect(provider).balanceOf(chain)
      console.log(balance.toString())

      return bridge.withdraw(l1TokenAddress, tokenAddress, tokenAmount, {
        gasLimit: 1000000,
        gasPrice: 0
      })
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const bridgeAddress =
        addresses.tokens[tokenSymbol][(chain as Chain).slug].l2CanonicalToken
      const bridge = new Contract(bridgeAddress, arbErc20Artifact.abi, provider)
      return bridge.withdraw(recipient, tokenAmount)
    } else {
      throw new Error('not implemented')
    }

    //const tx = await this.token.connect(provider).approve(chain, bridgeAddress)
    //console.log('waiting', tx?.hash)
    //await tx?.wait()
  }

  async checkMaxTokensAllowed (
    chain: Chain,
    canonicalBridge: Contract,
    amount: TAmount
  ) {
    if (chain.equals(Chain.xDai)) {
      const tokenAddress =
        addresses.tokens[this.token.symbol][Chain.Kovan.slug].l1CanonicalToken
      const maxPerTx = await canonicalBridge?.maxPerTx(tokenAddress)
      const formattedMaxPerTx = Number(
        formatUnits(maxPerTx.toString(), this.token.decimals)
      )
      const formattedAmount = Number(
        formatUnits(amount.toString(), this.token.decimals)
      )
      if (formattedAmount > formattedMaxPerTx) {
        throw new Error(
          `Max allowed by xDai Bridge is ${formattedMaxPerTx} tokens`
        )
      }
    }
  }

  async getSignerOrProvider (chain: TChain, signer: Signer = this.signer) {
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (!signer.provider) {
      return signer.connect(chain.provider)
    }
    const connectedChainId = await signer.getChainId()
    if (connectedChainId !== chain.chainId) {
      return chain.provider
    }
    return this.signer
  }

  getSignerAddress () {
    return this.signer?.getAddress()
  }
}

export default CanonicalBridge
