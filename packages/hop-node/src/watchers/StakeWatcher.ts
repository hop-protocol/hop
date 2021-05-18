import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
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
  dryMode?: boolean
}

class StakeWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: StakeWatcher }
  token: Token
  stakeMinThreshold: BigNumber = BigNumber.from(0)
  maxStakeAmount: BigNumber = BigNumber.from(0)
  interval: number = 60 * 1000
  private prevCacheKey: string = ''

  constructor (config: Config) {
    super({
      tag: 'stakeWatcher',
      prefix: config.label,
      logColor: 'green',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.token = new Token(config.tokenContract)
    if (config.stakeMinThreshold) {
      this.stakeMinThreshold = this.bridge.parseUnits(config.stakeMinThreshold)
    }
    if (config.maxStakeAmount) {
      this.maxStakeAmount = this.bridge.parseUnits(config.maxStakeAmount)
    }
  }

  async start () {
    this.started = true
    try {
      const isBonder = await this.bridge.isBonder()
      if (isBonder) {
        this.logger.debug('is bonder')
      } else {
        this.logger.warn('not a bonder')
      }
      const bonderAddress = await this.bridge.getBonderAddress()
      if (this.isL1) {
        this.logger.debug(`bonder address: ${bonderAddress}`)
      }
      this.logger.debug(
        `maxStakeAmount:`,
        this.bridge.formatUnits(this.maxStakeAmount)
      )
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
      rawDebit,
      debit,
      balance,
      allowance,
      bondedBondedWithdrawalsBalance
    ] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getRawDebit(),
      this.bridge.getDebit(),
      this.token.getBalance(),
      this.getTokenAllowance(),
      this.bridge.getBonderBondedWithdrawalsBalance()
    ])

    const cacheKey = [
      this.stakeMinThreshold,
      this.maxStakeAmount,
      balance,
      credit,
      rawDebit,
      debit
    ]
      .map(x => x.toString())
      .join('')
    // nothing has changed so return.
    if (this.prevCacheKey === cacheKey) {
      return
    }
    this.prevCacheKey = cacheKey

    this.logger.debug(`token balance:`, this.bridge.formatUnits(balance))
    this.logger.debug(`credit balance:`, this.bridge.formatUnits(credit))
    this.logger.debug(`raw debit balance:`, this.bridge.formatUnits(rawDebit))
    this.logger.debug(`debit balance:`, this.bridge.formatUnits(debit))
    this.logger.debug(
      `bonder bonded withdrawals balance:`,
      this.bridge.formatUnits(bondedBondedWithdrawalsBalance)
    )

    const bonderBridgeStakedAmount = credit
      .sub(rawDebit)
      .add(bondedBondedWithdrawalsBalance)
    const isL1 = isL1NetworkId(this.token.providerNetworkId)
    let amountToStake = BigNumber.from(0)
    if (bonderBridgeStakedAmount.lt(this.maxStakeAmount)) {
      amountToStake = this.maxStakeAmount.sub(bonderBridgeStakedAmount)
    }
    if (amountToStake.gt(this.bridge.parseUnits(5))) {
      if (balance.lt(amountToStake)) {
        if (!isL1) {
          const l1Bridge = this.siblingWatchers[networkSlugToId('ethereum')]
            .bridge as L1Bridge
          const l1Token = await l1Bridge.l1CanonicalToken()
          const l1Balance = await l1Token.getBalance()
          this.logger.debug(
            `l1 token balance:`,
            this.bridge.formatUnits(l1Balance)
          )
          if (l1Balance.gt(0)) {
            let convertAmount = amountToStake
            if (l1Balance.lt(amountToStake)) {
              convertAmount = l1Balance
            }
            this.logger.debug(
              `converting to L1 ${this.bridge.formatUnits(
                convertAmount
              )} canonical token to L2 hop token`
            )

            if (this.dryMode) {
              this.logger.warn('dry mode: skipping approve transaction')
              return
            }

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
          } token balance to stake. Have ${this.bridge.formatUnits(
            balance
          )}, need ${this.bridge.formatUnits(amountToStake)}`
        )
        return
      }
      if (allowance.lt(amountToStake)) {
        if (this.dryMode) {
          this.logger.warn('dry mode: skipping approve transaction')
          return
        }

        this.logger.debug('approving tokens')
        const tx = await this.approveTokens()
        this.logger.info(
          `stake approve tx:`,
          chalk.bgYellow.black.bold(tx?.hash)
        )
        await tx?.wait()
      }
      allowance = await this.getTokenAllowance()
      if (allowance.lt(amountToStake)) {
        this.logger.warn(
          `not enough ${
            isL1 ? 'canonical' : 'hop'
          } token allowance for bridge to stake. Have ${allowance}, need ${amountToStake}`
        )
        return
      }
      if (amountToStake.gt(0)) {
        if (this.dryMode) {
          this.logger.warn('dry mode: skipping stake transaction')
          return
        }
        this.logger.debug(
          `attempting to stake: ${this.bridge.formatUnits(amountToStake)}`
        )
        const tx = await this.bridge.stake(amountToStake)
        this.logger.info(`stake tx:`, chalk.bgYellow.black.bold(tx?.hash))
        await tx.wait()
        const newCredit = await this.bridge.getCredit()
        this.logger.debug(`credit balance:`, this.bridge.formatUnits(newCredit))
      }
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
