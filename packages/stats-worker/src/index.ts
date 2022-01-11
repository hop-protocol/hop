require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker()
  worker.start({
    apr: argv.apr,
    tvl: argv.tvl,
    volume: argv.volume
  })
}

main()
