require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    apr: argv.apr,
    tvl: argv.tvl,
    volume: argv.volume,
    fees: argv.fees,
    regenesis: argv.regenesis,
    days: argv.days,
    feeTokens: argv.feeTokens ? argv.feeTokens.split(',') : null,
    feeDays: argv.feeDays,
    feeSkipDays: argv.feeSkipDays
  })

  worker.start()
}

main()
