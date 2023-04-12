import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import fetch from 'node-fetch'
import polygonZkEvmBridgeAbi from './PolygonZkEvmBridge.json'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract } from 'ethers'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { config as globalConfig } from 'src/config'
import { solidityKeccak256 } from 'ethers/lib/utils'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class PolygonZkBridgeWatcher extends BaseWatcher {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    return this.relayXDomainMessage(commitTxHash, transferRootId, logger)
  }

  async relayXDomainMessage (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    const l1BridgeAddress = globalConfig.addresses[this.tokenSymbol].ethereum.l1Bridge
    const l2BridgeAddress = globalConfig.addresses[this.tokenSymbol][this.chainSlug].l2Bridge
    const l1PolygonBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'
    const l1Wallet = wallets.get(Chain.Ethereum)
    const polygonZkEvmBridge = new Contract(l1PolygonBridgeAddress, polygonZkEvmBridgeAbi, l1Wallet)

    const leafType = 1
    const originNetwork = 1 // 1 = L2
    const originAddress = l2BridgeAddress
    const amount = '0'
    const destinationNetwork = 0 // 0 = L1
    const destinationAddress = l1BridgeAddress
    let metadata = '0x'
    let index = 0

    const url = `https://bridge-api.public.zkevm-test.net/bridges/${l1BridgeAddress}?limit=25&offset=0`
    const res = await fetch(url)
    const json = await res.json()
    for (const item of json.deposits) {
      if (item.tx_hash === commitTxHash) {
        if (item.ready_for_claim) {
          index = item.deposit_cnt
          metadata = item.metadata
          break
        }
      }
    }

    if (!index) {
      this.logger.warn('expected deposit count index. Possibly not ready for claim yet')
      return
    }

    const metadataHash = solidityKeccak256(['bytes'], [metadata])
    const leafValue = await polygonZkEvmBridge.getLeafValue(
      leafType,
      originNetwork,
      originAddress,
      destinationNetwork,
      destinationAddress,
      amount,
      metadataHash
    )

    const proofUrl = `https://bridge-api.public.zkevm-test.net/merkle-proof?net_id=1&deposit_cnt=${index}`
    const proofRes = await fetch(proofUrl)
    const proofJson = await proofRes.json()
    const { merkle_proof: merkleProof, main_exit_root: mainExitRoot, rollup_exit_root: rollupExitRoot } = proofJson.proof
    const verified = await polygonZkEvmBridge.verifyMerkleProof(
      leafValue,
      merkleProof,
      index,
      rollupExitRoot
    )

    console.log('verified:', verified)

    if (!verified) {
      throw new Error('expected proof to be verified')
    }

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping relayXDomainMessage`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    const tx = await polygonZkEvmBridge.claimMessage(
      merkleProof,
      index,
      mainExitRoot,
      rollupExitRoot,
      originNetwork,
      originAddress,
      destinationNetwork,
      destinationAddress,
      amount,
      metadata
    )

    return tx
  }
}

export default PolygonZkBridgeWatcher
