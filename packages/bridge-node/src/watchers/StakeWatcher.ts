import '../moduleAlias'
import { Contract } from 'ethers'
import { wait } from 'src/utils'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import Token from './helpers/Token'

export interface Config {
  label: string
  bridgeContract: Contract
  tokenContract: Contract
  stakeMinThreshold: number
  stakeAmount: number
}

class StakeWatcher extends BaseWatcher {
  bridge: Bridge
  token: Token
  stakeMinThreshold: number
  stakeAmount: number
  interval: number = 60 * 1000

  constructor (config: Config) {
    super({
      tag: 'stakeWatcher',
      prefix: config.label,
      logColor: 'green'
    })
    this.bridge = new Bridge(config.bridgeContract)
    this.token = new Token(config.tokenContract)
    this.stakeMinThreshold = config.stakeMinThreshold
    this.stakeAmount = config.stakeAmount
  }

  async start () {
    this.started = true
    try {
      while (true) {
        if (!this.started) {
          return
        }
        await this.checkStake()
        await wait(this.interval)
      }
    } catch (err) {
      this.logger.log(`stake watcher error:`, err.message)
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async checkStake () {
    try {
      const isBonder = await this.bridge.isBonder()
      if (!isBonder) {
        throw new Error('Not a bonder')
      }

      let [credit, debit, balance, allowance] = await Promise.all([
        this.bridge.getCredit(),
        this.bridge.getDebit(),
        this.token.getBalance(),
        this.getTokenAllowance()
      ])

      this.logger.log(`credit balance:`, credit)
      this.logger.log(`debit balance:`, debit)

      if (credit < this.stakeMinThreshold) {
        if (balance < this.stakeAmount) {
          throw new Error(
            `not enough hop token balance to stake. Have ${balance}, need ${this.stakeAmount}`
          )
        }
        if (allowance < this.stakeAmount) {
          const tx = await this.approveTokens()
          this.logger.log(`stake approve tx:`, tx?.hash)
          await tx?.wait()
        }
        allowance = await this.getTokenAllowance()
        if (allowance < this.stakeAmount) {
          throw new Error(
            `not enough hop token allowance for bridge to stake. Have ${allowance}, need ${this.stakeAmount}`
          )
        }
        this.logger.log(`attempting to stake: ${this.stakeAmount.toString()}`)
        const tx = await this.bridge.stake(this.stakeAmount.toString())
        this.logger.log(`stake tx:`, tx?.hash)
      }
    } catch (err) {
      this.logger.log(`stake tx error:`, err.message)
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
