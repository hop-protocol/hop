import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import l1BridgeAbi from '@hop-protocol/core/abi/generated/L1_Bridge.json'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Signer, providers } from 'ethers'
import { IChainWatcher } from './classes/IChainWatcher'
import { Interface, keccak256 } from 'ethers/lib/utils'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Provider, utils } from 'zksync-web3'
import { config as globalConfig } from 'src/config'

const abi = [
  {
    type: 'function',
    name: 'consumeMessageFromL2',
    constant: false,
    inputs: [
      {
        name: 'l2BlockNumber',
        type: 'uint32',
        baseType: 'uint32',
        _isParamType: true
      },
      {
        name: 'index',
        type: 'uint256',
        baseType: 'uint256',
        _isParamType: true
      },
      {
        name: 'l2TxNumberInBlock',
        type: 'uint16',
        baseType: 'uint16',
        _isParamType: true
      },
      {
        name: 'message',
        type: 'bytes',
        baseType: 'bytes',
        _isParamType: true
      },
      {
        name: 'proof',
        type: 'bytes32[]',
        arrayLength: -1,
        arrayChildren: {
          name: null,
          type: 'bytes32',
          baseType: 'bytes32',
          _isParamType: true
        },
        baseType: 'array',
        _isParamType: true
      }
    ],
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    _isFragment: true
  }
]

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class ZkSyncBridgeWatcher extends BaseWatcher implements IChainWatcher {
  zkSyncProvider: Provider
  zkSyncMessageWrapper: Contract
  l1Wallet: Signer
  l1Provider: any

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    const rpcUrl = (globalConfig.networks as any)[Chain.ZkSync]?.rpcUrl
    if (!rpcUrl) {
      throw new Error('Missing ZkSync RPC URL')
    }

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l1Provider = this.l1Wallet.provider

    this.zkSyncProvider = new Provider(rpcUrl)

    const wrapperAddress = globalConfig.addresses?.[this.tokenSymbol]?.[globalConfig.network]?.l1MessengerWrapper
    if (!wrapperAddress) {
      throw new Error('expected l1MessengerWrapper address')
    }
    this.zkSyncMessageWrapper = new Contract(wrapperAddress, abi, this.l1Wallet)
  }

  private async isReadyToExit (commitTxHash: string, transferRootId: string): Promise<boolean> {
    const { message, messageHash } = await this.getEncodedMessage(transferRootId)

    console.log('Waiting for L1 block inclusion (this may take up to 4 hours)...')

    // this can take up to 1 hour on goerli, and up to 4 hours on production
    const { l1BatchNumber, l1BatchTxIndex, blockNumber } = await this.zkSyncProvider.getTransactionReceipt(commitTxHash)
    if (!l1BatchNumber) {
      return false
    }

    const zkAddress = await this.zkSyncProvider.getMainContractAddress()
    const sender = await this.getSenderAddress()
    const proofInfo = await this.zkSyncProvider.getMessageProof(blockNumber, sender, messageHash)
    if (!proofInfo) {
      return false
    }
    const index = proofInfo.id
    const proof = proofInfo.proof

    const mailboxL1Contract = new Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, this.l1Provider)

    // all the information of the message sent from L2
    const messageInfo = {
      txNumberInBlock: l1BatchTxIndex,
      sender,
      data: message
    }

    try {
      const isIncluded = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, index, messageInfo, proof)
      console.log('L2 block:', blockNumber)
      console.log('L1 Index for Tx in block:', l1BatchTxIndex)
      console.log('L1 Batch for block: ', l1BatchNumber)
      console.log('Inclusion proof:', proof)
      console.log('proveL2MessageInclusion:', isIncluded)
      return isIncluded
    } catch (err) {}
    return false
  }

  private async getConfirmRootArgs (transferRootId: string) {
    const chainId = await this.bridge.getChainId()
    const dbItem = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbItem) {
      throw new Error('expected db item')
    }

    const { transferRootHash, destinationChainId, totalAmount, committedAt } = dbItem
    if (!transferRootHash) {
      throw new Error('expected db item transferRootHash')
    }
    if (!destinationChainId) {
      throw new Error('expected db item destinationChainId')
    }
    if (!totalAmount) {
      throw new Error('expected db item totalAmount')
    }
    if (!committedAt) {
      throw new Error('expected db item committedAt')
    }

    return {
      chainId,
      transferRootHash,
      destinationChainId,
      totalAmount,
      committedAt
    }
  }

  private async getEncodedMessage (transferRootId: string) {
    const iface = new Interface(l1BridgeAbi)

    const {
      chainId,
      transferRootHash,
      destinationChainId,
      totalAmount,
      committedAt
    } = await this.getConfirmRootArgs(transferRootId)

    const args = [
      chainId,
      transferRootHash,
      destinationChainId,
      totalAmount,
      committedAt
    ]

    const message = iface.encodeFunctionData('confirmTransferRoot', args)
    const messageHash = keccak256(message)

    return {
      message,
      messageHash
    }
  }

  private async getMessageProofData (commitTxHash: string, transferRootId: string) {
    const { l1BatchNumber, l1BatchTxIndex, blockNumber } = await this.zkSyncProvider.getTransactionReceipt(commitTxHash)
    if (!l1BatchNumber) {
      throw new Error('expected l1BatchNumber')
    }

    const sender = await this.getSenderAddress()
    const { message, messageHash } = await this.getEncodedMessage(transferRootId)

    const proofInfo = await this.zkSyncProvider.getMessageProof(blockNumber, sender, messageHash)
    if (!proofInfo) {
      throw new Error('expected proof info')
    }
    const index = proofInfo.id
    const proof = proofInfo.proof

    return {
      index,
      proof,
      sender,
      message,
      messageHash,
      l1BatchNumber,
      l1BatchTxIndex
    }
  }

  private async getSenderAddress () {
    const l2ContractAddress = this.bridge.getAddress()
    return l2ContractAddress
  }

  public async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    const isReadyToExit = await this.isReadyToExit(commitTxHash, transferRootId)
    if (!isReadyToExit) {
      logger.warn(`transaction ${commitTxHash} not ready to exit`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })
    const tx = await this.relayL2ToL1Message(commitTxHash)
    if (!tx) {
      logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
      return
    }

    const msg = `sent chain ${this.bridge.chainId} confirmTransferRoot exit tx ${tx.hash}`
    logger.info(msg)
    this.notifier.info(msg)
  }

  public async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    // TODO: To implement. Should not rely on transferRootId since this should handle arbitrary l2 to l1 messages
    throw new Error('unimplemented')

    // if (!commitTxHash) {
    //   throw new Error('expected commitTxHash')
    // }
    // if (!transferRootId) {
    //   throw new Error('expected transferRootId')
    // }

    // const { index, proof, l1BatchNumber, l1BatchTxIndex, message } = await this.getMessageProofData(commitTxHash, transferRootId)

    // const tx = await this.zkSyncMessageWrapper.consumeMessageFromL2(
    //   l1BatchNumber,
    //   index,
    //   l1BatchTxIndex,
    //   message,
    //   proof
    // )
    // return tx
  }
}

export default ZkSyncBridgeWatcher
