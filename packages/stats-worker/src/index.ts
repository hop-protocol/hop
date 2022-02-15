require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    apr: argv.apr,
    tvl: argv.tvl,
    volume: argv.volume,
    bonder: argv.bonder,
    regenesis: argv.regenesis,
    days: argv.days,
    bonderTokens: argv.bonderTokens ? argv.bonderTokens.split(',') : null,
    bonderDays: argv.bonderDays
  })

  worker.start()
}

main()
