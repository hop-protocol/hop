import '../moduleAlias'
import { Command } from 'commander'
import * as config from 'src/config'
import { contracts } from 'src/contracts'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import arbbots from 'src/arb-bot/bots'
import { l2ArbitrumProvider } from 'src/wallets/l2ArbitrumWallet'
import { l2OptimismProvider } from 'src/wallets/l2OptimismWallet'
import l1WalletOld from 'src/wallets/l1WalletOld'

const providers: any = {
  arbitrum: l2ArbitrumProvider,
  optimism: l2OptimismProvider
}

const program = new Command()

const tokens = Object.keys(config.tokens)
const networks = ['arbitrum', 'optimism']

const startStakeWatchers = () => {
  for (let token of tokens) {
    for (let network of ['kovan'].concat(networks)) {
      const tokenContracts = contracts[token][network]
      if (!tokenContracts) {
        continue
      }
      let bridgeContract = tokenContracts.l2Bridge
      let tokenContract = tokenContracts.l2CanonicalToken
      if (network === 'kovan') {
        bridgeContract = tokenContracts.l1Bridge
        tokenContract = tokenContracts.l1CanonicalToken
      }
      new StakeWatcher({
        label: `${network} ${token}`,
        bridgeContract,
        tokenContract
      }).start()
    }
  }
}

program
  .command('bonder')
  .description('Start the bonder watchers')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        if (!contracts[token][network]) {
          continue
        }
        const label = `${network} ${token}`
        let l1Bridge = contracts[token].kovan.l1Bridge
        if (
          (token === 'DAI' && network === 'arbitrum') ||
          (token === 'DAI' && network === 'optimism')
        ) {
          l1Bridge = l1Bridge.connect(l1WalletOld)
        }

        new BondTransferRootWatcher({
          label,
          l1BridgeContract: l1Bridge,
          l2BridgeContract: contracts[token][network].l2Bridge
        }).start()

        new BondWithdrawalWatcher({
          label,
          l1BridgeContract: l1Bridge,
          l2BridgeContract: contracts[token][network].l2Bridge,
          // TODO
          contracts: {
            '69': contracts[token].optimism?.l2Bridge,
            '79377087078960': contracts[token].arbitrum?.l2Bridge
          },
          l2Provider: providers[network]
        }).start()

        new SettleBondedWithdrawalWatcher({
          label,
          l1BridgeContract: l1Bridge,
          l2BridgeContract: contracts[token][network].l2Bridge
        }).start()

        new CommitTransferWatcher({
          label,
          l2BridgeContract: contracts[token][network].l2Bridge
        }).start()
      }
    }

    startStakeWatchers()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        new ChallengeWatcher({
          label: network,
          l1BridgeContract: contracts[token].kovan.l1Bridge,
          l2BridgeContract: contracts[token][network].l2Bridge,
          l2Provider: providers[network]
        }).start()
      }
    }
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        new CommitTransferWatcher({
          label: network,
          l2BridgeContract: contracts[token][network].l2Bridge
        }).start()
      }
    }
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbbots.start()
  })

program
  .command('stake')
  .description('Start the stake watcher')
  .action(() => {
    startStakeWatchers()
  })

program.parse(process.argv)
