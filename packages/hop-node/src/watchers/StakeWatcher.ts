import '../moduleAlias'
import { Contract } from 'ethers'
import { wait, networkSlugToId, isL1NetworkId } from 'src/utils'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import Token from './helpers/Token'

export interface Config {
  label: string
  bridgeContract: Contract
  tokenContract: Contract
  stakeMinThreshold: number
  stakeAmount: number
  contracts: { [networkId: string]: Contract }
}

class StakeWatcher extends BaseWatcher {
  bridge: Bridge
  token: Token
  stakeMinThreshold: number
  stakeAmount: number
  interval: number = 60 * 1000
  contracts: { [networkId: string]: Contract }

  constructor (config: Config) {
    super({
      tag: 'stakeWatcher',
      prefix: config.label,
      logColor: 'green'
    })
    this.bridge = new Bridge(config.bridgeContract)
    this.token = new Token(config.tokenContract)
    this.stakeMinThreshold = config.stakeMinThreshold || 0
    this.stakeAmount = config.stakeAmount || 0
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    try {
      const isBonder = await this.bridge.isBonder()
      if (!isBonder) {
        this.logger.warn('not a bonder')
      }
      const bonderAddress = await this.bridge.getBonderAddress()
      this.logger.debug(`bonder address: ${bonderAddress}`)
      while (true) {
        if (!this.started) {
          return
        }
        try {
          await this.checkStake()
        } catch (err) {
          this.logger.error(`check state error: ${err.message}`)
          this.notifier.error(`check state error: ${err.message}`)
        }
        await wait(this.interval)
      }
    } catch (err) {
      this.logger.error(`stake watcher error:`, err.message)
      this.notifier.error(`watcher error: ${err.message}`)
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async checkStake () {
    const isBonder = await this.bridge.isBonder()
    if (!isBonder) {
      return
    }

    let [credit, debit, balance, allowance] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getDebit(),
      this.token.getBalance(),
      this.getTokenAllowance()
    ])

    this.logger.debug(`token balance:`, balance)
    this.logger.debug(`credit balance:`, credit)
    this.logger.debug(`debit balance:`, debit)

    const isL1 = isL1NetworkId(this.token.providerNetworkId)
    if (credit < this.stakeMinThreshold || credit - debit < this.stakeAmount) {
      if (balance < this.stakeAmount) {
        if (!isL1) {
          const l1Bridge = new L1Bridge(
            this.contracts[networkSlugToId('ethereum')]
          )
          const l1Token = await l1Bridge.l1CanonicalToken()
          const l1Balance = await l1Token.getBalance()
          this.logger.debug(`l1 token balance:`, l1Balance)
          if (l1Balance > 0) {
            const convertAmount = Math.min(l1Balance, this.stakeAmount)
            this.logger.debug(
              `converting to ${convertAmount} canonical token to hop token`
            )

            let tx: any
            const spender = l1Bridge.getAddress()
            tx = await l1Token.approve(spender)
            this.logger.info(`canonical token approve tx:`, tx?.hash)
            this.notifier.info(`approve tx: ${tx?.hash}`)
            await tx.wait()
            tx = await l1Bridge.convertCanonicalTokenToHopToken(
              this.token.providerNetworkId,
              convertAmount
            )
            this.logger.debug(`convert tx: ${tx?.hash}`)
            this.notifier.info(`convert tx: ${tx?.hash}`)
            await tx.wait()
            // wait enough time for canonical token transfer
            await wait(300 * 1000)
            return
          }
        }

        this.logger.warn(
          `not enough ${
            isL1 ? 'canonical' : 'hop'
          } token balance to stake. Have ${balance}, need ${this.stakeAmount}`
        )
        return
      }
      if (allowance < this.stakeAmount) {
        this.logger.debug('approving tokens')
        const tx = await this.approveTokens()
        this.logger.info(`stake approve tx:`, tx?.hash)
        await tx?.wait()
      }
      allowance = await this.getTokenAllowance()
      if (allowance < this.stakeAmount) {
        this.logger.warn(
          `not enough ${
            isL1 ? 'canonical' : 'hop'
          } token allowance for bridge to stake. Have ${allowance}, need ${
            this.stakeAmount
          }`
        )
        return
      }
      this.logger.debug(`attempting to stake: ${this.stakeAmount.toString()}`)
      const tx = await this.bridge.stake(this.stakeAmount.toString())
      this.logger.info(`stake tx:`, tx?.hash)
    }
  }

  async approveTokens () {
    const spender = this.bridge.getAddress()
    return this.token.approve(spender)
  }

  async getTokenAllowance () {
    const spender = this.bridge.getAddress()
    return this.token.getAllowance(spender)
  }
}

export default StakeWatcher
