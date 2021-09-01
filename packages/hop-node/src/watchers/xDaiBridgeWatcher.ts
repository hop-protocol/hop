import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import chalk from 'chalk'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, ethers } from 'ethers'
import { config as globalConfig } from 'src/config'
import { l1xDaiAmbAbi, l2xDaiAmbAbi } from '@hop-protocol/core/abi'
import { packSignatures, signatureToVRS, strip0x } from 'src/utils/xdaiUtils'
import { wait } from 'src/utils'

type Config = {
  chainSlug: string
  tokenSymbol: string
  label?: string
  l1BridgeContract?: Contract
  bridgeContract?: Contract
  isL1?: boolean
  dryMode?: boolean
}

export const getL1Amb = (token: string) => {
  const l1Wallet = wallets.get(Chain.Ethereum)
  const l1AmbAddress = globalConfig.tokens[token].xdai.l1Amb
  return new Contract(l1AmbAddress, l1xDaiAmbAbi, l1Wallet)
}

export const getL2Amb = (token: string) => {
  const l2xDaiProvider = wallets.get(Chain.xDai).provider
  const l2AmbAddress = globalConfig.tokens[token].xdai.l2Amb
  return new Contract(l2AmbAddress, l2xDaiAmbAbi, l2xDaiProvider)
}

export const executeExitTx = async (event: any, token: string) => {
  const l1Amb = getL1Amb(token)
  const l2Amb = getL2Amb(token)

  const message = event.args.encodedData
  const msgHash = ethers.utils.solidityKeccak256(['bytes'], [message])
  const id = await l2Amb.numMessagesSigned(msgHash)
  const alreadyProcessed = await l2Amb.isAlreadyProcessed(id)
  if (!alreadyProcessed) {
    return
  }

  const messageId =
    '0x' +
    Buffer.from(strip0x(message), 'hex')
      .slice(0, 32)
      .toString('hex')
  const alreadyRelayed = await l1Amb.relayedMessages(messageId)
  if (alreadyRelayed) {
    return
  }

  const requiredSigs = (await l2Amb.requiredSignatures()).toNumber()
  const sigs: any[] = []
  for (let i = 0; i < requiredSigs; i++) {
    const sig = await l2Amb.signature(msgHash, i)
    const [v, r, s]: any[] = [[], [], []]
    const vrs = signatureToVRS(sig)
    v.push(vrs.v)
    r.push(vrs.r)
    s.push(vrs.s)
    sigs.push(vrs)
  }
  const packedSigs = packSignatures(sigs)

  const tx = await l1Amb.executeSignatures(message, packedSigs)
  return {
    tx,
    msgHash,
    message,
    packedSigs
  }
}

// reference:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
class xDaiBridgeWatcher extends BaseWatcher {
  l1Bridge: L1Bridge

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'xDaiBridgeWatcher',
      prefix: config.label,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      dryMode: config.dryMode
    })
    if (config.l1BridgeContract) {
      this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    }
  }

  async start () {
    this.started = true
    try {
      const l1Amb = getL1Amb(this.tokenSymbol)
      const l2Amb = getL2Amb(this.tokenSymbol)

      this.logger.debug(`xDai ${this.tokenSymbol} bridge watcher started`)
      while (true) {
        if (!this.started) {
          return
        }
        const blockNumber = await l2Amb.provider.getBlockNumber()
        const events = await l2Amb?.queryFilter(
          l2Amb.filters.UserRequestForSignature(),
          (blockNumber as number) - 100
        )

        for (const event of events) {
          try {
            const result = await executeExitTx(event, this.tokenSymbol)
            if (!result) {
              continue
            }
            const { tx, msgHash, message, packedSigs } = result
            tx?.wait().then(() => {
              this.emit('executeSignatures', {
                message,
                packedSigs
              })
            })
            this.logger.debug('executeSignatures messageHash:', msgHash)
            this.logger.info(
              'executeSignatures tx hash:',
              chalk.bgYellow.black.bold(tx.hash)
            )
            await tx?.wait()
          } catch (err) {
            this.logger.error('tx error:', err.message)
          }
        }
        await wait(10 * 1000)
      }
    } catch (err) {
      this.logger.error('xDai bridge watcher error:', err)
      this.quit()
    }
  }

  async handleCommitTxHash (commitTxHash: string, transferRootHash: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const destinationChainId = dbTransferRoot?.destinationChainId
    const l2Amb = getL2Amb(this.tokenSymbol)
    const tx: any = await this.bridge.getTransaction(commitTxHash)
    const sigEvents = await l2Amb?.queryFilter(
      l2Amb.filters.UserRequestForSignature(),
      tx.blockNumber - 1,
      tx.blockNumber + 1
    )

    for (const sigEvent of sigEvents) {
      const { encodedData } = sigEvent.args
      // TODO: better way of slicing by method id
      const data = /ef6ebe5e00000/.test(encodedData)
        ? encodedData.replace(/.*(ef6ebe5e00000.*)/, '$1')
        : ''
      if (!data) {
        continue
      }
      const {
        rootHash,
        originChainId,
        destinationChain
      } = await this.l1Bridge.decodeConfirmTransferRootData(
        '0x' + data.replace('0x', '')
      )
      this.logger.debug(
          `attempting to send relay message on xdai for commit tx hash ${commitTxHash}`
      )
      await this.handleStateSwitch()
      if (this.isDryOrPauseMode) {
        this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping executeExitTx`)
        return
      }
      const result = await executeExitTx(sigEvent, this.tokenSymbol)
      if (result) {
        await this.db.transferRoots.update(transferRootHash, {
          sentConfirmTxAt: Date.now()
        })
        const { tx } = result
        tx?.wait()
          .then(async (receipt: any) => {
            if (receipt.status !== 1) {
              await this.db.transferRoots.update(transferRootHash, {
                sentConfirmTxAt: 0
              })
              throw new Error('status=0')
            }

            if (destinationChainId) {
              this.emit('transferRootConfirmed', {
                transferRootHash,
                destinationChainId
              })
            }
          })
          .catch(async (err: Error) => {
            this.db.transferRoots.update(transferRootHash, {
              sentConfirmTxAt: 0
            })

            throw err
          })
        this.logger.info('transferRootHash:', transferRootHash)
        this.logger.info(
            `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx`,
            chalk.bgYellow.black.bold(tx.hash)
        )
        this.notifier.info(
            `chainId: ${this.bridge.chainId} confirmTransferRoot L1 exit tx: ${tx.hash}`
        )
      }
    }
  }
}
export default xDaiBridgeWatcher
