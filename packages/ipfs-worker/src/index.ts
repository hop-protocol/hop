require('dotenv').config()
import Worker from './worker'

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

function main () {
  const worker = new Worker({
    pollIntervalSeconds: argv.pollIntervalSeconds
  })

  worker.start()
}

main()
