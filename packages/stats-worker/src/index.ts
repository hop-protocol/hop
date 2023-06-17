require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    yields: argv.yields,
    prices: argv.prices,
    tvl: argv.tvl,
    amm: argv.amm,
    ammDays: argv.ammDays,
    ammOffsetDays: argv.ammOffsetDays,
    ammTokens: argv.ammTokens ? argv.ammTokens.split(',') : null,
    ammChains: argv.ammChains ? argv.ammChains.split(',') : null,
    volume: argv.volume,
    bonder: argv.bonder,
    bonderProfit: argv.bonderProfit,
    bonderFees: argv.bonderFees,
    bonderTxFees: argv.bonderTxFees,
    regenesis: argv.regenesis,
    days: argv.days,
    offsetDays: argv.offsetDays,
    bonderTokens: argv.bonderTokens ? argv.bonderTokens.split(',') : null,
    bonderDays: argv.bonderDays,
    bonderStartDate: argv.bonderStartDate,
    bonderEndDate: argv.bonderEndDate,
    pollIntervalSeconds: argv.pollIntervalSeconds,
    pricesPollIntervalSeconds: argv.pricesPollIntervalSeconds
  })

  worker.start()
}

main()
