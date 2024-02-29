import { Interface } from 'ethers/lib/utils.js'
import { getProvider } from './utils/getProvider.js'

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

export class Nft {
  network: string

  constructor (network: string = 'goerli') {
    this.network = network
  }

  populateTransaction: any = {
    getRpcProvider (chainId: number) {
      return getProvider('goerli', chainId)
    },

    mintNft (input: MintNftInput) {
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

    approveNft (input: ApproveNftInput) {
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
}
