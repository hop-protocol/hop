import '../moduleAlias'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  chains: any[]
}

class StakeWatcher extends BaseWatcher {
  chains: any[]
  interval: number = 60 * 1000

  constructor (config: Config) {
    super({
      label: 'stakeWatcher',
      logColor: 'green'
    })
    this.chains = config.chains
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

    for (let { label, contract } of this.chains) {
      try {
        const credit = await this.getCredit(contract)
        const debit = await this.getDebit(contract)
        this.logger.log(`${label} credit balance:`, credit)
        this.logger.log(`${label} debit balance:`, debit)

        if (credit < threshold) {
          // TODO: check balance and approval
          const parsedAmount = parseUnits(amount.toString(), 18)
          this.logger.log(`staking ${amount}`)
          const tx = await contract.stake(parsedAmount)
          this.logger.log(`stake ${label} tx:`, tx?.hash)
        }
      } catch (err) {
        this.logger.log(`${label} stake tx error:`, err.message)
      }
    }
  }

  async getCredit (contract: any) {
    const credit = (await contract.getCredit()).toString()
    return Number(formatUnits(credit, 18))
  }

  async getDebit (contract: any) {
    const debit = (await contract.getDebit()).toString()
    return Number(formatUnits(debit, 18))
  }

  private async getTokenBalance (contract: any) {
    const address = await contract.signer.getAddress()
    const balance = await contract.balanceOf(address)
    const formattedBalance = Number(formatUnits(balance, 18))
    return formattedBalance
  }
}

export default StakeWatcher
