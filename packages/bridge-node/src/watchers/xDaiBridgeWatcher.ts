import { ethers, Contract } from 'ethers'
import chalk from 'chalk'
import Logger from 'src/logger'
import l2xDaiAmbAbi from 'src/abi/L2_xDaiAMB.json'
import l1xDaiAmbAbi from 'src/abi/L1_xDaiAMB.json'
import * as config from 'src/config'
import l1Wallet from 'src/wallets/l1Wallet'
import { l2xDaiProvider } from 'src/wallets/l2xDaiWallet'
import { signatureToVRS, packSignatures, strip0x } from 'src/utils/xdaiUtils'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

// reference:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
class xDaiBridgeWatcher extends BaseWatcher {
  constructor () {
    super({
      tag: 'xDaiBridgeWatcher',
      logColor: 'yellow'
    })
  }

  async start () {
    try {
      const l1AmbAddress = config.tokens.DAI.xdai.l1Amb
      const l2AmbAddress = config.tokens.DAI.xdai.l2Amb
      const l2Amb = new Contract(l2AmbAddress, l2xDaiAmbAbi.abi, l2xDaiProvider)
      const l1Amb = new Contract(l1AmbAddress, l1xDaiAmbAbi.abi, l1Wallet)

      while (true) {
        const blockNumber = await l2xDaiProvider.getBlockNumber()
        const events = await l2Amb?.queryFilter(
          l2Amb.filters.UserRequestForSignature(),
          (blockNumber as number) - 100
        )

        for (let event of events) {
          try {
            const message = event.args.encodedData
            const msgHash = ethers.utils.solidityKeccak256(['bytes'], [message])
            const id = await l2Amb.numMessagesSigned(msgHash)
            const alreadyProcessed = await l2Amb.isAlreadyProcessed(id)
            if (!alreadyProcessed) {
              continue
            }

            const messageId =
              '0x' +
              Buffer.from(strip0x(message), 'hex')
                .slice(0, 32)
                .toString('hex')
            const alreadyRelayed = await l1Amb.relayedMessages(messageId)
            if (alreadyRelayed) {
              continue
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
            tx?.wait().then(() => {
              this.emit('executeSignatures', {
                message,
                packedSigs
              })
            })
            this.logger.debug('executeSignatures messageHash:', msgHash)
            this.logger.debug(
              'executeSignatures tx hash:',
              chalk.bgYellow.black.bold(tx.hash)
            )
            await tx?.wait()
          } catch (err) {
            this.emit('error', err)
            this.logger.error('tx error:', err.message)
          }
        }
        await wait(10 * 1000)
      }
    } catch (err) {
      this.emit('error', err)
      this.logger.error('watcher error:', err.message)
    }
  }
}
export default xDaiBridgeWatcher
