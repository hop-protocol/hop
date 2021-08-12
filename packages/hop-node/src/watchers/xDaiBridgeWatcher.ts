import BaseWatcher from './classes/BaseWatcher'
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
}

export const getL1Amb = (token: string) => {
  const l1Wallet = wallets.getRelayer(Chain.Ethereum)
  const l1AmbAddress = globalConfig.tokens[token].xdai.l1Amb
  return new Contract(l1AmbAddress, l1xDaiAmbAbi, l1Wallet)
}

export const getL2Amb = (token: string) => {
  const l2xDaiProvider = wallets.getRelayer(Chain.xDai).provider
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
  // TODO: check if enough funds for gas
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
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'xDaiBridgeWatcher',
      logColor: 'yellow'
    })
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
}
export default xDaiBridgeWatcher
