import '../moduleAlias'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  label: string
  bridgeContract: any
  tokenContract: any
}

class StakeWatcher extends BaseWatcher {
  label: string
  bridgeContract: any
  tokenContract: any
  interval: number = 60 * 1000

  constructor (config: Config) {
    super({
      label: 'stakeWatcher',
      logColor: 'green'
    })
    this.label = config.label
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
      this.logger.log(`stake watcher error:`, err.message)
    }
  }

  async stop () {
    this.started = false
  }

  async check () {
    const threshold = 1000
    const amount = 1000

    try {
      const credit = await this.getCredit()
      const debit = await this.getDebit()
      this.logger.log(`${this.label} credit balance:`, credit)
      this.logger.log(`${this.label} debit balance:`, debit)

      let [balance, allowance] = await Promise.all([
        this.getTokenBalance(),
        this.getTokenAllowance()
      ])

      if (credit < threshold) {
        if (balance < amount) {
          throw new Error(
            `${this.label} not enough balance to stake. Have ${balance}, need ${amount}`
          )
        }
        if (allowance < amount) {
          const tx = await this.approveTokens()
          this.logger.log(`stake ${this.label} approve tx:`, tx?.hash)
          await tx?.wait()
        }
        allowance = await this.getTokenAllowance()
        if (allowance < amount) {
          throw new Error(
            `${this.label} not enough allowance for bridge to stake. Have ${allowance}, need ${amount}`
          )
        }
        const tx = await this.stake(amount.toString())
        this.logger.log(`stake ${this.label} tx:`, tx?.hash)
      }
    } catch (err) {
      this.logger.log(`${this.label} stake tx error:`, err.message)
    }
  }

  async getCredit () {
    let credit: string
    if (/xdai/i.test(this.label)) {
      const bonder = await this.getBonderAddress()
      credit = (await this.bridgeContract.getCredit(bonder)).toString()
    } else {
      credit = (await this.bridgeContract.getCredit()).toString()
    }

    return Number(formatUnits(credit, 18))
  }

  async getDebit () {
    let debit: string
    if (/xdai/i.test(this.label)) {
      const bonder = await this.getBonderAddress()
      debit = (
        await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
      ).toString()
    } else {
      debit = (await this.bridgeContract.getDebit()).toString()
    }
    return Number(formatUnits(debit, 18))
  }

  async stake (amount: string) {
    const parsedAmount = parseUnits(amount, 18)
    this.logger.log(`${this.label} staking ${amount}`)
    if (/xdai/i.test(this.label)) {
      const bonder = await this.getBonderAddress()
      return this.bridgeContract.stake(bonder, parsedAmount)
    } else {
      return this.bridgeContract.stake(parsedAmount)
    }
  }

  async getTokenBalance () {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    const formattedBalance = Number(formatUnits(balance, 18))
    return formattedBalance
  }

  async approveTokens () {
    const maxApproval = parseUnits('1000000', 18)
    const spender = this.bridgeContract.address
    return this.tokenContract.approve(spender, maxApproval)
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
