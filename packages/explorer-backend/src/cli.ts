import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    transfers: argv.transfers,
    days: argv.days,
    offsetDays: argv.offsetDays
  })

  worker.start()
}

main()
