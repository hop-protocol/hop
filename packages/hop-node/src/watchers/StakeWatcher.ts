import '../moduleAlias'
import { Contract } from 'ethers'
import chalk from 'chalk'
import { wait, networkSlugToId, isL1NetworkId } from 'src/utils'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import Token from './helpers/Token'

export interface Config {
  label: string
  isL1: boolean
  bridgeContract: Contract
  tokenContract: Contract
  stakeMinThreshold: number
  maxStakeAmount: number
}

class StakeWatcher extends BaseWatcher {
  siblingWatchers: { [networkId: string]: StakeWatcher }
  token: Token
  stakeMinThreshold: number
  maxStakeAmount: number
  interval: number = 60 * 1000

  constructor (config: Config) {
    super({
      tag: 'stakeWatcher',
      prefix: config.label,
      logColor: 'green',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract
    })
    this.token = new Token(config.tokenContract)
    this.stakeMinThreshold = config.stakeMinThreshold || 0
    this.maxStakeAmount = config.maxStakeAmount || 0
  }

  async start () {
    this.started = true
    try {
      const isBonder = await this.bridge.isBonder()
      if (isBonder) {
        this.logger.warn('is bonder')
      } else {
        this.logger.warn('not a bonder')
      }
      const bonderAddress = await this.bridge.getBonderAddress()
      if (this.isL1) {
        this.logger.debug(`bonder address: ${bonderAddress}`)
      }
      this.logger.debug(`maxStakeAmount:`, this.maxStakeAmount)
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

    let [
      credit,
      debit,
      balance,
      allowance,
      bondedBondedWithdrawalsBalance
    ] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getRawDebit(),
      this.token.getBalance(),
      this.getTokenAllowance(),
      this.bridge.getBonderBondedWithdrawalsBalance()
    ])

    this.logger.debug(`token balance:`, balance)
    this.logger.debug(`credit balance:`, credit)
    this.logger.debug(`debit balance:`, debit)
    this.logger.debug(
      `bonder bonded withdrawals balance:`,
      bondedBondedWithdrawalsBalance
    )

    const bonderBridgeStakedAmount =
      credit - debit + bondedBondedWithdrawalsBalance
    const isL1 = isL1NetworkId(this.token.providerNetworkId)
    let amountToStake = 0
    if (bonderBridgeStakedAmount < this.maxStakeAmount) {
      amountToStake = this.maxStakeAmount - bonderBridgeStakedAmount
    }
    if (amountToStake > 0) {
      if (balance < amountToStake) {
        if (!isL1) {
          const l1Bridge = this.siblingWatchers[networkSlugToId('ethereum')]
            .bridge as L1Bridge
          const l1Token = await l1Bridge.l1CanonicalToken()
          const l1Balance = await l1Token.getBalance()
          this.logger.debug(`l1 token balance:`, l1Balance)
          if (l1Balance > 0) {
            const convertAmount = Math.min(l1Balance, amountToStake)
            this.logger.debug(
              `converting to L1 ${convertAmount} canonical token to L2 hop token`
            )

            let tx: any
            const spender = l1Bridge.getAddress()
            tx = await l1Token.approve(spender)
            this.logger.info(
              `L1 canonical token approve tx:`,
              chalk.bgYellow.black.bold(tx?.hash)
            )
            this.notifier.info(`L1 approve tx: ${tx?.hash}`)
            await tx.wait()
            tx = await l1Bridge.convertCanonicalTokenToHopToken(
              this.token.providerNetworkId,
              convertAmount
            )
            this.logger.debug(
              `convert tx: ${chalk.bgYellow.black.bold(tx?.hash)}`
            )
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
          } token balance to stake. Have ${balance}, need ${amountToStake}`
        )
        return
      }
      if (allowance < amountToStake) {
        this.logger.debug('approving tokens')
        const tx = await this.approveTokens()
        this.logger.info(
          `stake approve tx:`,
          chalk.bgYellow.black.bold(tx?.hash)
        )
        await tx?.wait()
      }
      allowance = await this.getTokenAllowance()
      if (allowance < amountToStake) {
        this.logger.warn(
          `not enough ${
            isL1 ? 'canonical' : 'hop'
          } token allowance for bridge to stake. Have ${allowance}, need ${amountToStake}`
        )
        return
      }
      this.logger.debug(`attempting to stake: ${amountToStake.toString()}`)
      const tx = await this.bridge.stake(amountToStake.toString())
      this.logger.info(`stake tx:`, chalk.bgYellow.black.bold(tx?.hash))
      await tx.wait()
      const newCredit = await this.bridge.getCredit()
      this.logger.debug(`credit balance:`, newCredit)
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
