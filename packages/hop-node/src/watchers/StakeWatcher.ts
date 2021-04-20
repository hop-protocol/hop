import '../moduleAlias'
import { Contract } from 'ethers'
import { wait, isL1NetworkId } from 'src/utils'
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
    this.stakeMinThreshold = config.stakeMinThreshold
    this.stakeAmount = config.stakeAmount
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    try {
      const isBonder = await this.bridge.isBonder()
      if (!isBonder) {
        this.logger.warn('not a bonder')
      }
      while (true) {
        if (!this.started) {
          return
        }
        await this.checkStake()
        await wait(this.interval)
      }
    } catch (err) {
      this.logger.error(`stake watcher error:`, err.message)
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
        console.log('y')
        return
      }

      let [credit, debit, balance, allowance] = await Promise.all([
        this.bridge.getCredit(),
        this.bridge.getDebit(),
        this.token.getBalance(),
        this.getTokenAllowance()
      ])

      this.logger.debug(`credit balance:`, credit)
      this.logger.debug(`debit balance:`, debit)

      const isL1 = isL1NetworkId(this.token.providerNetworkId)
      if (credit < this.stakeMinThreshold) {
        if (balance < this.stakeAmount) {
          if (!isL1) {
            const l1Bridge = new L1Bridge(this.contracts['42'])
            const l1Token = await l1Bridge.l1CanonicalToken()
            const l1Balance = await l1Token.getBalance()
            if (l1Balance > 0) {
              const convertAmount = Math.min(l1Balance, this.stakeAmount)
              this.logger.debug(
                `converting to ${convertAmount} canonical token to hop token`
              )
              const tx = await l1Bridge.convertCanonicalTokenToHopToken(
                this.token.providerNetworkId,
                convertAmount
              )
              this.logger.debug(`convert tx: ${tx?.hash}`)
              await tx.wait()
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
    } catch (err) {
      this.logger.error(`stake tx error:`, err.message)
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
