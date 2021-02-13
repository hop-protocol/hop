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
    try {
      while (true) {
        await this.check()
        await wait(this.interval)
      }
    } catch (err) {
      this.logger.log(`stake watcher error:`, err.message)
    }
  }

  async check () {
    const threshold = 1000
    const amount = 1000

    try {
      const credit = await this.getCredit()
      const debit = await this.getDebit()
      this.logger.log(`${this.label} credit balance:`, credit)
      this.logger.log(`${this.label} debit balance:`, debit)

      const [balance, allowance] = await Promise.all([
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
          throw new Error(
            `${this.label} not enough allowance for bridge to stake. Have ${allowance}, need ${amount}`
          )
        }
        const parsedAmount = parseUnits(amount.toString(), 18)
        this.logger.log(`staking ${amount}`)
        const tx = await this.bridgeContract.stake(parsedAmount)
        this.logger.log(`stake ${this.label} tx:`, tx?.hash)
      }
    } catch (err) {
      this.logger.log(`${this.label} stake tx error:`, err.message)
    }
  }

  async getCredit () {
    const credit = (await this.bridgeContract.getCredit()).toString()
    return Number(formatUnits(credit, 18))
  }

  async getDebit () {
    const debit = (await this.bridgeContract.getDebit()).toString()
    return Number(formatUnits(debit, 18))
  }

  private async getTokenBalance () {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    const formattedBalance = Number(formatUnits(balance, 18))
    return formattedBalance
  }

  private async getTokenAllowance () {
    const owner = await this.tokenContract.signer.getAddress()
    const spender = this.bridgeContract.address
    const allowance = await this.tokenContract.allowance(owner, spender)
    const formattedBalance = Number(formatUnits(allowance, 18))
    return formattedBalance
  }
}

export default StakeWatcher
