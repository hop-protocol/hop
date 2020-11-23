import './moduleAlias'
import ArbitrumCommitTransferWatcher from 'src/watchers/ArbitrumCommitTransferWatcher'
import ArbitrumBondTransferRootWatcher from 'src/watchers/ArbitrumBondTransferRootWatcher'
import ArbitrumChallengeWatcher from 'src/watchers/ArbitrumChallengeWatcher'

async function main () {
  ArbitrumCommitTransferWatcher().catch(console.error)
  ArbitrumBondTransferRootWatcher().catch(console.error)
  ArbitrumChallengeWatcher().catch(console.error)
}

main()
