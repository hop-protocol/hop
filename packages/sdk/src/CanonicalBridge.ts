import { ethers, Signer, Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { addresses } from './config'
import {
  arbErc20Abi,
  l1xDaiForeignOmniBridgeAbi,
  l1OptimismTokenBridgeAbi,
  arbitrumGlobalInboxAbi,
  l2OptimismTokenBridgeAbi,
  l2xDaiTokenAbi,
  l1PolygonPosRootChainManagerAbi,
  l2PolygonChildErc20Abi
} from '@hop-protocol/abi'
import { Chain } from './models'
import { TChain, TToken, TAmount, TProvider } from './types'
import TokenClass from './Token'
import Base from './Base'

class CanonicalBridge extends Base {
  public signer: TProvider
  public chain: Chain
  public token: TokenClass

  constructor (signer: TProvider, token: TToken, chain?: TChain) {
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

  get address () {
    const tokenSymbol = this.token.symbol
    if (!tokenSymbol) {
      return null
    }
    if (!this.chain) {
      return null
    }
    const bridgeAddress =
      addresses[tokenSymbol][this.chain.slug].l1CanonicalBridge
    return bridgeAddress
  }

  connect (signer: TProvider) {
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
      addresses[tokenSymbol][(chain as Chain).slug].l1CanonicalBridge
    const provider = await this.getSignerOrProvider(Chain.Ethereum, this.signer)
    const tokenAddress =
      addresses[tokenSymbol][Chain.Ethereum.slug].l1CanonicalToken

    //const balance = await this.token.connect(provider).balanceOf(Chain.Ethereum)
    //const tx = await this.token.connect(provider).approve(Chain.Ethereum, bridgeAddress)
    //await tx?.wait()

    if ((chain as Chain).equals(Chain.xDai)) {
      const bridge = new Contract(
        bridgeAddress,
        l1xDaiForeignOmniBridgeAbi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, tokenAmount)
      return bridge.relayTokens(tokenAddress, recipient, tokenAmount, {
        // xDai requires a higher gas limit
        gasLimit: 1000000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const l2TokenAddress =
        addresses[tokenSymbol][(chain as Chain).slug].l2CanonicalToken
      const bridge = new Contract(
        bridgeAddress,
        l1OptimismTokenBridgeAbi,
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
      const arbChain = addresses[tokenSymbol][chain.slug].arbChain
      const bridge = new Contract(
        bridgeAddress,
        arbitrumGlobalInboxAbi,
        provider
      )
      await this.checkMaxTokensAllowed(chain, bridge, tokenAmount)
      return bridge.depositERC20Message(
        arbChain,
        tokenAddress,
        recipient,
        tokenAmount
      )
    } else if ((chain as Chain).equals(Chain.Polygon)) {
      const bridgeAddress =
        addresses[tokenSymbol][chain.slug].l1PosRootChainManager
      const bridge = new Contract(
        bridgeAddress,
        l1PolygonPosRootChainManagerAbi,
        provider
      )
      const coder = ethers.utils.defaultAbiCoder
      const payload = coder.encode(['uint256'], [tokenAmount])
      return bridge.depositFor(recipient, tokenAddress, payload)
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
        addresses[tokenSymbol][(chain as Chain).slug].l2CanonicalBridge
      const tokenAddress = addresses[tokenSymbol][chain.slug].l2CanonicalToken

      const bridge = new Contract(tokenAddress, l2xDaiTokenAbi, provider)
      return bridge.transferAndCall(bridgeAddress, tokenAmount, '0x', {
        // xDai requires a higher gas limit
        gasLimit: 1000000
      })
    } else if ((chain as Chain).equals(Chain.Optimism)) {
      const bridgeAddress =
        addresses[tokenSymbol][(chain as Chain).slug].l2CanonicalBridge
      const l1TokenAddress =
        addresses[tokenSymbol][Chain.Ethereum.slug].l1CanonicalToken
      const tokenAddress = addresses[tokenSymbol][chain.slug].l2CanonicalToken
      const bridge = new Contract(
        bridgeAddress,
        l2OptimismTokenBridgeAbi,
        provider
      )

      return bridge.withdraw(l1TokenAddress, tokenAddress, tokenAmount, {
        // optimism requires a high gas limit and 0 gas price
        gasLimit: 1000000,
        gasPrice: 0
      })
    } else if ((chain as Chain).equals(Chain.Arbitrum)) {
      const bridgeAddress =
        addresses[tokenSymbol][(chain as Chain).slug].l2CanonicalToken
      const bridge = new Contract(bridgeAddress, arbErc20Abi, provider)
      return bridge.withdraw(recipient, tokenAmount)
    } else if ((chain as Chain).equals(Chain.Polygon)) {
      const tokenAddress = addresses[tokenSymbol][chain.slug].l2CanonicalToken
      const token = new Contract(tokenAddress, l2PolygonChildErc20Abi, provider)
      return token.withdraw(tokenAmount)
    } else {
      throw new Error('not implemented')
    }

    //const balance = await this.token.connect(provider).balanceOf(chain)
    //console.log(balance.toString())
    //const tx = await this.token.connect(provider).approve(chain, bridgeAddress)
    //console.log('waiting', tx?.hash)
    //await tx?.wait()
  }

  // Finalize Polygon withdrawal exit from L2 to L1
  async exit (txHash: string, chain: TChain) {
    chain = this.toChainModel(chain)
    const tokenSymbol = this.token.symbol
    const recipient = await this.getSignerAddress()
    const { MaticPOSClient } = require('@maticnetwork/maticjs')
    const Web3 = require('web3')
    const maticPOSClient = new MaticPOSClient({
      network: Chain.Ethereum.chainId === 1 ? 'mainnet' : 'testnet',
      maticProvider: new Web3.providers.HttpProvider(Chain.Polygon.rpcUrl),
      parentProvider: new Web3.providers.HttpProvider(Chain.Ethereum.rpcUrl),
      posRootChainManager:
        addresses[tokenSymbol][chain.slug].l1PosRootChainManager,
      posERC20Predicate: addresses[tokenSymbol][chain.slug].l1PosErc20Predicate
    })

    const tx = await maticPOSClient.exitERC20(txHash, {
      from: recipient,
      encodeAbi: true
    })

    const provider = await this.getSignerOrProvider(chain, this.signer)
    return (provider as any).sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  async checkMaxTokensAllowed (
    chain: Chain,
    canonicalBridge: Contract,
    amount: TAmount
  ) {
    if (chain.equals(Chain.xDai)) {
      const tokenAddress =
        addresses[this.token.symbol][Chain.Ethereum.slug].l1CanonicalToken
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

  async getSignerOrProvider (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (!(signer as Signer)?.provider) {
      return (signer as Signer)?.connect(chain.provider)
    }
    const connectedChainId = await (signer as Signer)?.getChainId()
    if (connectedChainId !== chain.chainId) {
      return chain.provider
    }

    return signer
  }

  getSignerAddress () {
    return (this.signer as Signer)?.getAddress()
  }
}

export default CanonicalBridge
