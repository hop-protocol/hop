import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'
import { UINT256 } from 'src/constants'

export interface Config {
  label: string
  bridgeContract: Contract
  tokenContract: Contract
  stakeMinThreshold: number
  stakeAmount: number
}

class StakeWatcher extends BaseWatcher {
  bridgeContract: Contract
  tokenContract: Contract
  stakeMinThreshold: number
  stakeAmount: number
  interval: number = 60 * 1000

  constructor (config: Config) {
    super({
      tag: 'stakeWatcher',
      prefix: config.label,
      logColor: 'green'
    })
    this.bridgeContract = config.bridgeContract
    this.tokenContract = config.tokenContract
  }

  async start () {
    this.started = true
    try {
      while (true) {
        if (!this.started) {
          return
        }
        await this.check()
        await wait(this.interval)
      }
    } catch (err) {
      this.emit('error', err)
      this.logger.log(`stake watcher error:`, err.message)
    }
  }

  async stop () {
    this.started = false
  }

  async check () {
    try {
      const isBonder = await this.isBonder()
      if (!isBonder) {
        throw new Error('Not a bonder')
      }

      const credit = await this.getCredit()
      const debit = await this.getDebit()
      this.logger.log(`credit balance:`, credit)
      this.logger.log(`debit balance:`, debit)

      let [balance, allowance] = await Promise.all([
        this.getTokenBalance(),
        this.getTokenAllowance()
      ])

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
        const tx = await this.stake(this.stakeAmount.toString())
        this.logger.log(`stake tx:`, tx?.hash)
      }
    } catch (err) {
      this.emit('error', err)
      this.logger.log(`stake tx error:`, err.message)
    }
  }

  async getCredit () {
    const bonder = await this.getBonderAddress()
    const credit = (await this.bridgeContract.getCredit(bonder)).toString()
    return Number(formatUnits(credit, 18))
  }

  async getDebit () {
    const bonder = await this.getBonderAddress()
    const debit = (
      await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
    ).toString()
    return Number(formatUnits(debit, 18))
  }

  async stake (amount: string) {
    const parsedAmount = parseUnits(amount, 18)
    this.logger.log(`staking ${amount}`)
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.stake(bonder, parsedAmount)
  }

  async isBonder () {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  }

  async getTokenBalance () {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    const formattedBalance = Number(formatUnits(balance, 18))
    return formattedBalance
  }

  async approveTokens () {
    const spender = this.bridgeContract.address
    return this.tokenContract.approve(spender, UINT256)
  }

  async getTokenAllowance () {
    const owner = await this.tokenContract.signer.getAddress()
    const spender = this.bridgeContract.address
    const allowance = await this.tokenContract.allowance(owner, spender)
    const formattedBalance = Number(formatUnits(allowance, 18))
    return formattedBalance
  }

  async getBonderAddress () {
    return this.bridgeContract.signer.getAddress()
  }
}

export default StakeWatcher
