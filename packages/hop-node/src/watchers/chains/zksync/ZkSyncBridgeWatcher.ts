import AbstractChainWatcher from '../AbstractChainWatcher'
import { Chain } from 'src/constants'
import { IChainWatcher } from '../../classes/IChainWatcher'
import { Provider as ZkSyncProvider, utils } from 'zksync-web3'
import { config as globalConfig } from 'src/config'
import { providers } from 'ethers'

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

class ZkSyncBridgeWatcher extends AbstractChainWatcher implements IChainWatcher {
  zkSyncProvider: ZkSyncProvider

  constructor () {
    super(Chain.ZkSync)

    const rpcUrl = (globalConfig.networks as any)[Chain.ZkSync]?.rpcUrl
    this.zkSyncProvider = new ZkSyncProvider(rpcUrl)
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

  // private async _isReadyToExit (commitTxHash: string, transferRootId: string): Promise<boolean> {
  //   const { message, messageHash } = await this._getEncodedMessage(transferRootId)

  //   console.log('Waiting for L1 block inclusion (this may take up to 4 hours)...')

  //   // this can take up to 1 hour on goerli, and up to 4 hours on production
  //   const { l1BatchNumber, l1BatchTxIndex, blockNumber } = await this.zkSyncProvider.getTransactionReceipt(commitTxHash)
  //   if (!l1BatchNumber) {
  //     return false
  //   }

  //   const zkAddress = await this.zkSyncProvider.getMainContractAddress()
  //   const sender = await this._getSenderAddress()
  //   const proofInfo = await this.zkSyncProvider.getMessageProof(blockNumber, sender, messageHash)
  //   if (!proofInfo) {
  //     return false
  //   }
  //   const index = proofInfo.id
  //   const proof = proofInfo.proof

  //   const mailboxL1Contract = new Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, this.l1Wallet.provider!)

  //   // all the information of the message sent from L2
  //   const messageInfo = {
  //     txNumberInBlock: l1BatchTxIndex,
  //     sender,
  //     data: message
  //   }

  //   try {
  //     const isIncluded = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, index, messageInfo, proof)
  //     console.log('L2 block:', blockNumber)
  //     console.log('L1 Index for Tx in block:', l1BatchTxIndex)
  //     console.log('L1 Batch for block: ', l1BatchNumber)
  //     console.log('Inclusion proof:', proof)
  //     console.log('proveL2MessageInclusion:', isIncluded)
  //     return isIncluded
  //   } catch (err) {}
  //   return false
  // }

  // private async _getConfirmRootArgs (transferRootId: string) {
  //   const dbItem = await this.db.transferRoots.getByTransferRootId(transferRootId)
  //   if (!dbItem) {
  //     throw new Error('expected db item')
  //   }

  //   const { transferRootHash, destinationChainId, totalAmount, committedAt } = dbItem
  //   if (!transferRootHash) {
  //     throw new Error('expected db item transferRootHash')
  //   }
  //   if (!destinationChainId) {
  //     throw new Error('expected db item destinationChainId')
  //   }
  //   if (!totalAmount) {
  //     throw new Error('expected db item totalAmount')
  //   }
  //   if (!committedAt) {
  //     throw new Error('expected db item committedAt')
  //   }

  //   return {
  //     chainId,
  //     transferRootHash,
  //     destinationChainId,
  //     totalAmount,
  //     committedAt
  //   }
  // }

  // private async _getEncodedMessage (transferRootId: string) {
  //   const iface = new Interface(l1BridgeAbi)

  //   const {
  //     chainId,
  //     transferRootHash,
  //     destinationChainId,
  //     totalAmount,
  //     committedAt
  //   } = await this._getConfirmRootArgs(transferRootId)

  //   const args = [
  //     chainId,
  //     transferRootHash,
  //     destinationChainId,
  //     totalAmount,
  //     committedAt
  //   ]

  //   const message = iface.encodeFunctionData('confirmTransferRoot', args)
  //   const messageHash = keccak256(message)

  //   return {
  //     message,
  //     messageHash
  //   }
  // }

  // private async _getMessageProofData (commitTxHash: string, transferRootId: string) {
  //   const { l1BatchNumber, l1BatchTxIndex, blockNumber } = await this.zkSyncProvider.getTransactionReceipt(commitTxHash)
  //   if (!l1BatchNumber) {
  //     throw new Error('expected l1BatchNumber')
  //   }

  //   const sender = await this._getSenderAddress()
  //   const { message, messageHash } = await this._getEncodedMessage(transferRootId)

  //   const proofInfo = await this.zkSyncProvider.getMessageProof(blockNumber, sender, messageHash)
  //   if (!proofInfo) {
  //     throw new Error('expected proof info')
  //   }
  //   const index = proofInfo.id
  //   const proof = proofInfo.proof

  //   return {
  //     index,
  //     proof,
  //     sender,
  //     message,
  //     messageHash,
  //     l1BatchNumber,
  //     l1BatchTxIndex
  //   }
  // }

  // private async _getSenderAddress () {
  //   const l2ContractAddress = this.bridge.getAddress()
  //   return l2ContractAddress
  // }
}

export default ZkSyncBridgeWatcher
