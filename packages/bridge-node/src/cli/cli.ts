import '../moduleAlias'
import { Command } from 'commander'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import { arbBot } from 'src/arb-bot'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import L2OptimismBridgeContract from 'src/contracts/L2OptimismBridgeContract'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { L2OptimismProvider } from 'src/wallets/L2OptimismWallet'

const program = new Command()

program
  .command('bonder')
  .description('Start the bonder watchers')
  .action(() => {
    new BondTransferRootWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract
    }).start()

    new BondWithdrawalWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract,
      L2Provider: L2ArbitrumProvider
    }).start()

    new SettleBondedWithdrawalWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract
    }).start()

    new CommitTransferWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract
    }).start()

    new BondTransferRootWatcher({
      label: 'Optimism',
      L2BridgeContract: L2OptimismBridgeContract
    }).start()

    new BondWithdrawalWatcher({
      label: 'Optimism',
      L2BridgeContract: L2OptimismBridgeContract,
      L2Provider: L2OptimismProvider
    }).start()

    new SettleBondedWithdrawalWatcher({
      label: 'Optimism',
      L2BridgeContract: L2OptimismBridgeContract
    }).start()

    new CommitTransferWatcher({
      label: 'Optimism',
      L2BridgeContract: L2OptimismBridgeContract
    }).start()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    new ChallengeWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract,
      L2Provider: L2ArbitrumProvider
    }).start()
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    new CommitTransferWatcher({
      label: 'Arbitrum',
      L2BridgeContract: L2ArbitrumBridgeContract
    }).start()
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbBot.start()
  })

program.parse(process.argv)
