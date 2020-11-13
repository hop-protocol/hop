import './moduleAlias'
import watcher1 from 'src/watchers/watcher1'
import watcher2 from 'src/watchers/watcher2'
import watcher3 from 'src/watchers/watcher3'

async function main () {
  watcher1().catch(console.error)

  watcher2().catch(console.error)

  watcher3().catch(console.error)
}

main()
