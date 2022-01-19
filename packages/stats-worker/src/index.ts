require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    apr: argv.apr,
    tvl: argv.tvl,
    volume: argv.volume,
    regenesis: argv.regenesis,
    days: argv.days
  })

  worker.start()
}

main()
