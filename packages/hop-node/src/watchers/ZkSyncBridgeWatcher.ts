import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import l1BridgeAbi from '@hop-protocol/core/abi/generated/L1_Bridge.json'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Provider, utils } from 'zksync-web3'
import { ethers, providers } from 'ethers'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class ZkSyncBridgeWatcher extends BaseWatcher {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async isReadyToExit (commitTxHash: string): Promise<boolean> {
    const l2ContractAddress = this.bridge.getAddress()
    const l1Wallet = wallets.get(Chain.Ethereum)
    const l1Provider = l1Wallet.provider
    const rpcUrl = (globalConfig.networks as any)[Chain.ZkSync]?.rpcUrl
    if (!rpcUrl) {
      throw new Error('Missing ZkSync RPC URL')
    }
    const zkSyncProvider = new Provider(rpcUrl)

    const iface = new ethers.utils.Interface(l1BridgeAbi)
    const chainId = await this.bridge.getChainId()

    // TODO: get these from TransfersCommitted event or db item
    const rootHash = '' // TODO
    const destinationChainId = 0 // TODO
    const totalAmount = '' // TODO
    const rootCommittedAt = '' // TODO

    const args = [
      chainId,
      rootHash,
      destinationChainId,
      totalAmount,
      rootCommittedAt
    ]
    const message = iface.encodeFunctionData('confirmTransferRoot', args)
    const messageHash = ethers.utils.keccak256(message)

    console.log('Waiting for L1 block inclusion (this may take up to 1 hour)...')

    const { l1BatchNumber, l1BatchTxIndex, blockNumber } = await zkSyncProvider.getTransactionReceipt(commitTxHash)
    if (!l1BatchNumber) {
      return false
    }

    const zkAddress = await zkSyncProvider.getMainContractAddress()
    const sender = l2ContractAddress
    const proofInfo = await zkSyncProvider.getMessageProof(blockNumber, sender, messageHash)
    if (!proofInfo) {
      return false
    }
    const index = proofInfo.id
    const proof = proofInfo.proof

    const mailboxL1Contract = new ethers.Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, l1Provider)

    // all the information of the message sent from L2
    const messageInfo = {
      txNumberInBlock: l1BatchTxIndex,
      sender,
      data: message
    }

    try {
      const result = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, index, messageInfo, proof)
      console.log('L2 block:', blockNumber)
      console.log('L1 Index for Tx in block:', l1BatchTxIndex)
      console.log('L1 Batch for block: ', l1BatchNumber)
      console.log('Inclusion proof:', proof)
      console.log('proveL2MessageInclusion:', result)
      return result
    } catch (err) {}
    return false
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    const isReadyToExit = await this.isReadyToExit(commitTxHash)
    if (!isReadyToExit) {
      logger.warn(`transaction ${commitTxHash} not ready to exit`)
      return
    }

    throw new Error('not implemented')
  }

  async relayXDomainMessage (commitTxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('not implemented')
  }
}

export default ZkSyncBridgeWatcher
