import watcher1 from 'src/watchers/watcher1'
import watcher2 from 'src/watchers/watcher2'
import watcher3 from 'src/watchers/watcher3'

async function main () {
  watcher1()
    .then(console.log)
    .catch(console.error)

  watcher2()
    .then(console.log)
    .catch(console.error)

  watcher3()
    .then(console.log)
    .catch(console.error)
}

main()
