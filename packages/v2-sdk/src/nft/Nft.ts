import { Base, BaseConfig } from '#common/index.js'
import { Interface } from 'ethers/lib/utils.js'
import { Signer } from 'ethers'
import { getProvider } from '#utils/getProvider.js'
import { ConfirmationSent, ConfirmationSentEventFetcher } from '#nft/events/ConfirmationSent.js'
import { TokenConfirmed, TokenConfirmedEventFetcher } from '#nft/events/TokenConfirmed.js'
import { TokenSent, TokenSentEventFetcher } from '#nft/events/TokenSent.js'
import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { addresses } from '#addresses/index.js'

type GetEventsInput = {
  chainId: number
  fromBlock: number
  toBlock?: number
}

export type MintNftInput = {
  fromChainId: number
  contractAddress: string
  recipient: string
  tokenId: string
}

export type ApproveNftInput = {
  fromChainId: number
  contractAddress: string
  spender: string
  tokenId: string
}

export type MintNftWrapperInput = {
  nftBridgeAddress: string
  wrapperTokenId: string
  fromChainId: number
  serialNumber: string
  supportedChains: number[]
  wrapperTokenIdNonce: number
}

export type ReclaimNftWrapperInput = {
  nftBridgeAddress: string
  nftTokenAddress: string
  tokenId: string
  fromChainId: number
  serialNumber: string
  supportedChainIds: number[]
  wrapperTokenIdNonce: number
}

export type SendNftInput = {
  fromChainId: number
  nftBridgeAddress: string
  contractAddress: string
  tokenId: string
  supportedChainIds: number[]
  toChainId: number
  recipient: string
  wrapperTokenIdNonce: number
}

export type SendNftWrapperInput = {
  nftBridgeAddress: string
  wrapperTokenId: string
  fromChainId: number
  serialNumber: string
  supportedChainIds: number[]
  initialRecipient: string
  toChainId: number
  recipient: string
  wrapperTokenIdNonce: number
}

export type GetNftMintPopulatedTxInput = {
  fromChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftBurnPopulatedTxInput = {
  fromChainId: number,
  tokenId: string
}

export type GetNftSendPopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftMintAndSendPopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftConfirmPopulatedTxInput = {
  fromChainId: number,
  tokenId: string
}

export type NftConfig = BaseConfig & {}

export class Nft extends Base {
  batchBlocks?: number = 1000

  constructor (config: NftConfig) {
    super({ network: config.network, signer: config.signer, contractAddresses: config.contractAddresses })
  }

  override connect (signer: Signer) {
    return new Nft({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  get populateTransaction() {
    return {
      mintNft: (input: MintNftInput) => {
        const { contractAddress, fromChainId, recipient, tokenId } = input
        const ABI = [
          'function safeMint(address to, uint256 tokenId)'
        ]

        const iface = new Interface(ABI)
        const data = iface.encodeFunctionData('safeMint', [recipient, tokenId])
        const txData = {
          to: contractAddress,
          data
        }

        return txData
      },

      approveNft: (input: ApproveNftInput) => {
        const { contractAddress, fromChainId, spender, tokenId } = input
        const ABI = [
          'function approve(address spender, uint256 tokenId)'
        ]

        const iface = new Interface(ABI)
        const data = iface.encodeFunctionData('approve', [spender, tokenId])
        const txData = {
          to: contractAddress,
          data
        }

        return txData
      }
    }
  }

  mintNftWrapper (input: MintNftWrapperInput) {
    const { nftBridgeAddress, wrapperTokenId, fromChainId, serialNumber, supportedChains, wrapperTokenIdNonce } = input
    const ABI = [
      'function mintWrapper(uint256 wrapperTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, uint256 wrapperTokenIdNonce) public'
    ]

    const iface = new Interface(ABI)
    const data = iface.encodeFunctionData('mintWrapper', [wrapperTokenId, fromChainId, serialNumber, supportedChains, wrapperTokenIdNonce])
    const txData = {
      to: nftBridgeAddress,
      data
    }

    return txData
  }

  reclaimNftWrapper (input: ReclaimNftWrapperInput) {
    const { nftBridgeAddress, nftTokenAddress, tokenId, fromChainId, serialNumber, supportedChainIds, wrapperTokenIdNonce } = input
    const ABI = [
      'function mintWrapperAndWithdraw(address nftTokenAddress, uint256 nftTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, uint256 wrapperTokenIdNonce) public'
    ]

    const iface = new Interface(ABI)
    const data = iface.encodeFunctionData('mintWrapperAndWithdraw', [nftTokenAddress, tokenId, fromChainId, serialNumber, supportedChainIds, wrapperTokenIdNonce])
    const txData = {
      to: nftBridgeAddress,
      data
    }

    return txData
  }

  sendNft (input: SendNftInput) {
    const { nftBridgeAddress, fromChainId, contractAddress, tokenId, supportedChainIds, toChainId, recipient, wrapperTokenIdNonce } = input
    const ABI = [
      'function depositAndAttemptMintAndSend(address nftTokenAddress, uint256 nftTokenId, uint256[] memory supportedChainIds, uint256 toChainId, address recipient, uint256 wrapperTokenIdNonce) public returns (uint256, bytes32)'
    ]

    const iface = new Interface(ABI)
    const args = [contractAddress, tokenId, supportedChainIds, toChainId, recipient, wrapperTokenIdNonce]
    const data = iface.encodeFunctionData('depositAndAttemptMintAndSend', args)
    const txData = {
      to: nftBridgeAddress,
      data
    }

    return txData
  }

  sendNftWrapper (input: SendNftWrapperInput) {
    const { nftBridgeAddress, wrapperTokenId, fromChainId, serialNumber, supportedChainIds, initialRecipient, toChainId, recipient, wrapperTokenIdNonce } = input
    const ABI = [
      'function send(uint256 wrapperTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, address initialRecipient, uint256 toChainId, address recipient, uint256 wrapperTokenIdNonce) public'
    ]

    const iface = new Interface(ABI)
    const data = iface.encodeFunctionData('send', [wrapperTokenId, fromChainId, serialNumber, supportedChainIds, initialRecipient, toChainId, recipient, wrapperTokenIdNonce])
    const value = '1000000000000'
    const txData = {
      to: nftBridgeAddress,
      data,
      value
    }

    return txData
  }

  async getNftConfirmationSentEvents (input: GetEventsInput): Promise<ConfirmationSent[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getNftTokenConfirmedEvents (input: GetEventsInput): Promise<TokenConfirmed[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getNftTokenSentEvents (input: GetEventsInput): Promise<TokenSent[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  getNftBridgeContractAddress (chainId: number): string {
    return this.getConfigAddress(chainId, 'nftBridge')
  }

  async getNftMintPopulatedTx (input: GetNftMintPopulatedTxInput): Promise<any> {
    const { fromChainId, toAddress, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!toAddress) {
      throw new Error('toAddress is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Nft bridge address not found for chainId "${fromChainId}"`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.mint(toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftBurnPopulatedTx (input: GetNftBurnPopulatedTxInput): Promise<any> {
    const { fromChainId, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.burn(tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftSendPopulatedTx (input: GetNftSendPopulatedTxInput): Promise<any> {
    const { fromChainId, toChainId, toAddress, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    if (!toAddress) {
      throw new Error('toAddress is required')
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.send(toChainId, toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftMintAndSendPopulatedTx (input: GetNftMintAndSendPopulatedTxInput): Promise<any> {
    const { fromChainId, toChainId, toAddress, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    if (!toAddress) {
      throw new Error('toAddress is required')
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.mintAndSend(toChainId, toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftConfirmPopulatedTx (input: GetNftConfirmPopulatedTxInput): Promise<any> {
    const { fromChainId, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.confirm(tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }
}
