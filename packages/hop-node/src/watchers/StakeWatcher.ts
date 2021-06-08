import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import chalk from 'chalk'
import { wait, isL1ChainId } from 'src/utils'
import BaseWatcher from './classes/BaseWatcher'
import Bridge from './classes/Bridge'
import L1Bridge from './classes/L1Bridge'
import Token from './classes/Token'
import { config } from 'src/config'
import { Chain } from 'src/constants'

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
    // TODO: remove
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
      this.printAmounts()
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

  async printAmounts () {
    let [credit, rawDebit, debit, balance, allowance] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getRawDebit(),
      this.bridge.getDebit(),
      this.token.getBalance(),
      this.getTokenAllowance()
    ])

    this.logger.debug(`token balance:`, this.bridge.formatUnits(balance))
    this.logger.debug(`credit balance:`, this.bridge.formatUnits(credit))
    this.logger.debug(`raw debit balance:`, this.bridge.formatUnits(rawDebit))
    this.logger.debug(`debit balance:`, this.bridge.formatUnits(debit))

    const bondedBondedWithdrawalsBalance = await this.bridge.getBonderBondedWithdrawalsBalance()

    const bonderBridgeStakedAmount = credit
      .sub(rawDebit)
      .add(bondedBondedWithdrawalsBalance)

    this.logger.debug(
      `bonder bonded withdrawals balance:`,
      this.bridge.formatUnits(bondedBondedWithdrawalsBalance)
    )
    this.logger.debug(
      `bonder bridge calculated actual staked amount:`,
      this.bridge.formatUnits(bonderBridgeStakedAmount)
    )
  }

  async convertAndStake (amount: BigNumber) {
    const balance = await this.token.getBalance()
    const isL1 = isL1ChainId(await this.token.getChainId())
    if (balance.lt(amount)) {
      if (!isL1) {
        const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
          .bridge as L1Bridge
        const l1Token = await l1Bridge.l1CanonicalToken()
        const l1Balance = await l1Token.getBalance()
        this.logger.debug(
          `l1 token balance:`,
          this.bridge.formatUnits(l1Balance)
        )
        if (l1Balance.gt(0)) {
          let convertAmount = amount
          if (l1Balance.lt(amount)) {
            convertAmount = l1Balance
          }
          this.logger.debug(
            `converting to L1 ${this.bridge.formatUnits(
              convertAmount
            )} canonical token to L2 hop token`
          )

          let tx: any
          const spender = l1Bridge.getAddress()
          tx = await l1Token.approve(spender)
          this.logger.info(
            `L1 canonical token approve tx:`,
            chalk.bgYellow.black.bold(tx?.hash)
          )
          if (tx) {
            this.notifier.info(`L1 approve tx: ${tx?.hash}`)
            await tx.wait()
          }
          tx = await l1Bridge.convertCanonicalTokenToHopToken(
            this.token.chainId,
            convertAmount
          )
          if (tx) {
            this.logger.debug(
              `convert tx: ${chalk.bgYellow.black.bold(tx?.hash)}`
            )
            this.notifier.info(`convert tx: ${tx?.hash}`)
            await tx.wait()
          }

          // wait enough time for canonical token transfer
          const delayMs = config.isMainnet ? 600 * 1000 : 300 * 1000
          await wait(delayMs)
        }

        const balance = await this.token.getBalance()
        if (balance.lt(amount)) {
          throw new Error(
            `not enough ${
              isL1 ? 'canonical' : 'hop'
            } token balance to stake. Have ${this.bridge.formatUnits(
              balance
            )}, need ${this.bridge.formatUnits(amount)}`
          )
        }
      }
    }

    return this.stake(amount)
  }

  async stake (amount: BigNumber) {
    const isBonder = await this.bridge.isBonder()
    if (!isBonder) {
      throw new Error('not a bonder')
    }
    const formattedAmount = this.bridge.formatUnits(amount)
    const balance = await this.token.getBalance()
    const isL1 = isL1ChainId(await this.token.getChainId())
    if (balance.lt(amount)) {
      throw new Error(
        `not enough ${
          isL1 ? 'canonical' : 'hop'
        } token balance to stake. Have ${this.bridge.formatUnits(
          balance
        )}, need ${formattedAmount}`
      )
    }
    this.logger.debug(`attempting to stake ${formattedAmount} tokens`)
    const tx = await this.bridge.stake(amount)
    this.logger.info(`stake tx:`, chalk.bgYellow.black.bold(tx?.hash))
    const receipt = await tx.wait()
    if (receipt.status) {
      this.logger.debug(`successfully staked ${formattedAmount} tokens`)
    } else {
      this.logger.error(`stake unsuccessful. tx status=0`)
    }
    const newCredit = await this.bridge.getCredit()
    this.logger.debug(`credit balance:`, this.bridge.formatUnits(newCredit))
    return tx
  }

  async unstake (amount: BigNumber) {
    const isBonder = await this.bridge.isBonder()
    if (!isBonder) {
      throw new Error('not a bonder')
    }
    const parsedAmount = this.bridge.formatUnits(amount)
    const [credit, debit] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getDebit()
    ])
    const creditBalance = credit.sub(debit)
    if (amount.gt(creditBalance)) {
      throw new Error(
        `cannot unstake more than credit balance of ${this.bridge.formatUnits(
          creditBalance
        )}`
      )
    }
    this.logger.debug(`attempting to unstake ${parsedAmount} tokens`)
    const tx = await this.bridge.unstake(amount)
    this.logger.info(`unstake tx:`, chalk.bgYellow.black.bold(tx?.hash))
    const receipt = await tx.wait()
    if (receipt.status) {
      this.logger.debug(`successfully unstaked ${parsedAmount} tokens`)
    } else {
      this.logger.error(`unstake was unsuccessful. tx status=0`)
    }
    return tx
  }

  async approveTokens () {
    const spender = this.bridge.getAddress()
    const tx = await this.token.approve(spender)
    if (tx) {
      this.logger.info(
        `stake approve tokens tx:`,
        chalk.bgYellow.black.bold(tx?.hash)
      )
    }
    await tx?.wait()
    return tx
  }

  async getTokenAllowance () {
    const spender = this.bridge.getAddress()
    return this.token.getAllowance(spender)
  }
}

export default StakeWatcher
