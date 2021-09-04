require('dotenv').config()
import Worker from './worker'

function main () {
  const worker = new Worker()
  worker.start()
}

main()
