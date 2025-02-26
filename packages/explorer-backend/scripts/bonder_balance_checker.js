const ethers = require('ethers')
const chalk = require('chalk')

class BalanceChecker {
  constructor (rpcUrl, addresses) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.addresses = addresses
  }

  async fetchBalances () {
    const balancePromises = this.addresses.map(async ({ label, address }) => {
      const balanceBigInt = await this.provider.getBalance(address)
      const balance = ethers.utils.formatEther(balanceBigInt)
      return { label, address, balance }
    })

    const balanceData = await Promise.all(balancePromises)
    return balanceData
  }

  displayTable (balanceData) {
    console.log(chalk.bold('Address Balances on Ethereum:'))
    console.log('+---------+------------------------------------------+-----------+')
    console.log('| Label   | Address                                  | Balance   |')
    console.log('+---------+------------------------------------------+-----------+')

    balanceData.forEach(({ label, address, balance }) => {
      let color
      const numericBalance = parseFloat(balance)
      if (numericBalance < 0.01) {
        color = chalk.red
      } else if (numericBalance < 0.5) {
        color = chalk.yellow
      } else {
        color = chalk.green // Green text for balances >= 0.5 ETH
      }

      console.log(
                `| ${color(label.padEnd(7))} | ${color(address)} | ${color(balance.padStart(9) + ' ETH')} |`
      )
      console.log('+---------+------------------------------------------+-----------+')
    })
  }
}

const ethereumRpcUrl = 'https://1rpc.io/eth'
const addresses = [
  { label: 'USDC', address: '0xAb46D6A0c7971E79506a373E1b3bD4E0240d3AFF' }, // relayer
  { label: 'USDT', address: '0x698d6c5475e95aa821b4ed4913831b96f6680ec9' },
  { label: 'MATIC', address: '0xd8781ca9163e9f132a4d8392332e64115688013a' },
  { label: 'DAI', address: '0x10720f58Cf4A22fa540ff10430fD967d2ef102de' },
  { label: 'ETH', address: '0x710bDa329b2a6224E4B44833DE30F38E7f81d564' },
  { label: 'HOP', address: '0x881296Edcb252080bd476c464cEB521d08df7631' },
  { label: 'SNX', address: '0x547d28cDd6A69e3366d6aE3EC39543F09Bd09417' },
  { label: 'sUSD', address: '0x547d28cDd6A69e3366d6aE3EC39543F09Bd09417' },
  { label: 'rETH', address: '0xD38B96277df34F1f7ac5965F86016E7d02c4Ca94' },
  { label: 'MAGIC', address: '0xa251E7519cbCf76e33D4672d2218e3CbcCEB6d60' },
]

async function main() {
  const balanceChecker = new BalanceChecker(ethereumRpcUrl, addresses)

  const balances = await balanceChecker.fetchBalances()
  balanceChecker.displayTable(balances)
}

main().catch(console.error)
