import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { BigNumber, providers, utils, Signer } from 'ethers'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class LineaBridgeWatcher extends BaseWatcher {
  l1Wallet: Signer
  l2Wallet: Signer

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Linea)
  }
  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    try {
      return await this._relayXDomainMessage(l1TxHash)
    } catch (err) {
      throw new Error(`relayL1ToL2Message error: ${err.message}`)
    }
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    // TODO
  }

  async _relayXDomainMessage (txHash: string): Promise<providers.TransactionResponse>  {
    // TODO: Add isRelayable check
    // TODO: This will not currently work for roots. Do this for roots as well

    let transfer
    const dbTransfers = await this.db.transfers.getTransfersFromWeek()
    for (const dbTransfer of dbTransfers) {
      if (dbTransfer.transferSentTxHash?.toLowerCase() === txHash.toLowerCase()) {
        transfer = dbTransfer
        break
      }
    }

    if (!transfer) {
      throw new Error(`transfer not found for tx hash ${txHash}`)
    }

    // Constants
    const l1MessengerWrapperAddress = globalConfig.addresses?.[this.tokenSymbol]?.[globalConfig.network]?.l1MessengerWrapper
    const l2LineaMessengerAddress = '0xC499a572640B64eA1C8c194c43Bc3E19940719dC'
    const fee = 0
    const value = 0

    // Hop tx
    const hopAbi = ['function distribute(address,uint256,uint256,uint256,address,uint256)']
    const hopIface = new utils.Interface(hopAbi)
    const hopData = hopIface.encodeFunctionData('distribute', [
      transfer.recipient,
      transfer.amount,
      transfer.amountOutMin,
      transfer.deadline,
      transfer.relayer,
      transfer.relayerFee
    ])

    // Linea tx
    const abi = ['function claimMessage(address,address,uint256,uint256,address,bytes,uint256)']
    const iface = new utils.Interface(abi)
    let data = [
      l1MessengerWrapperAddress,
      transfer.recipient,
      fee,
      value,
      transfer.relayer,
      hopData
    ]

    // Get linea nonce
    const lineaNonceStr: string = await this.l1Wallet.call({
      to: l1MessengerWrapperAddress,
      data: '0x76815e84' // lastMessageNonce
    })

    // Iterate over nonces until we find one that works
    const lineaNonce: number = Number(lineaNonceStr)
    const maxNumIterations = 10
    for (let i = lineaNonce; i > lineaNonce - maxNumIterations; i--) {
      try {
        data.push(i)
        const txData = iface.encodeFunctionData('claimMessage', data)

        // Intentionally await to catch err
        return await this.l2Wallet.sendTransaction({
          to: l2LineaMessengerAddress,
          data: txData
        })
      } catch (err) {
        if (i === lineaNonce - maxNumIterations) {
          throw new Error(`failed to relay xDomain message: ${err.message}`)
        }
        data.pop()
      }
    }

    throw new Error('failed to relay xDomain message')
  }
}

export default LineaBridgeWatcher
