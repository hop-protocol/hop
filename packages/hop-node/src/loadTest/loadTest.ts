import fetch from 'node-fetch'
import expect from 'expect'
import { startWatchers } from 'src/watchers/watchers'
import { wait, isL1ChainId, chainSlugToId, chainIdToSlug } from 'src/utils'
import {
  User,
  waitForEvent,
  generateUser,
  generateUsers,
  prepareAccounts,
  getBalances
} from '../../test/helpers'
import {
  faucetPrivateKey,
  mnemonic,
  privateKey as testUserPrivateKey
} from '../../test/config'
import { config } from 'src/config'
import Logger from 'src/logger'
// @ts-ignore
import { Chain } from 'src/constants'
import { Notifier } from 'src/notifier'

const paths = [
  [Chain.xDai, Chain.Polygon],
  [Chain.Polygon, Chain.xDai]
]
const tokens = ['USDC']
const transferAmount = 0.3
const useTestUserPrivateKey = false

type Config = {
  concurrentUsers: number
  iterations: number
}

class LoadTest {
  concurrentUsers: number = 1
  iterations: number = 1

  constructor (config: Config) {
    if (config.concurrentUsers) {
      this.concurrentUsers = config.concurrentUsers
    }
    if (config.iterations) {
      this.iterations = config.iterations
    }
  }

  async start () {
    const logger = new Logger({
      tag: 'LoadTest'
    })
    logger.debug('concurrent users:', this.concurrentUsers)
    logger.debug('iterations:', this.iterations)
    const transactions: any = {}
    const amounts: any = {}
    const bonded: any = {}

    let count = 0
    let failedIndex = -1
    let failedTxHash = ''
    while (count < this.iterations) {
      const promises: Promise<any>[] = []
      for (let path of paths) {
        const sourceNetwork = path[0]
        const destNetwork = path[1]
        if (!transactions[sourceNetwork]) {
          transactions[sourceNetwork] = []
        }
        if (!amounts[sourceNetwork]) {
          amounts[sourceNetwork] = []
        }
        promises.push(
          new Promise(async (resolve, reject) => {
            for (let token of tokens) {
              const label = `${token} ${sourceNetwork} → ${destNetwork}`
              const logger = new Logger({
                tag: 'LoadTest',
                prefix: label
              })
              const notifier = new Notifier('LoadTest')
              try {
                const faucet = new User(faucetPrivateKey)
                const users = []
                if (useTestUserPrivateKey) {
                  const user = generateUser(testUserPrivateKey)
                  for (let i = 0; i < this.concurrentUsers; i++) {
                    // simulate users using same signer
                    users.push(user)
                  }
                } else {
                  users.push(...generateUsers(this.concurrentUsers, mnemonic))
                }
                for (let i in users) {
                  logger.debug(`#${i} account: ${await users[i].getAddress()}`)
                }
                await prepareAccounts(
                  users,
                  faucet,
                  token,
                  sourceNetwork,
                  transferAmount
                )

                await Promise.all(
                  users.map(async (user: User, i: number) => {
                    let tx: any
                    try {
                      const recipient = await user.getAddress()
                      const spender = user.getBridgeAddress(
                        sourceNetwork,
                        token
                      )
                      logger.log(`user #${i} - checking approval`)
                      await user.checkApproval(sourceNetwork, token, spender)
                      logger.log(`user #${i} - sending tx`)
                      tx = await user.send(
                        sourceNetwork,
                        destNetwork,
                        token,
                        transferAmount
                      )
                      logger.log(`user #${i} - tx hash: ${tx.hash}`)
                      logger.log(`user #${i} - waiting for receipt`)
                      transactions[sourceNetwork].push(tx.hash)
                      amounts[sourceNetwork] += transferAmount
                      await tx?.wait()
                    } catch (err) {
                      failedIndex = i
                      failedTxHash = tx?.hash
                      throw err
                    }
                  })
                )

                logger.log(`cohort sent`)
              } catch (err) {
                console.error(err)
                logger.error(
                  `#${failedIndex} (tx ${failedTxHash}) load test error: ${err.message}`
                )
                notifier.error(`${label}\n${err.message}`)
                logger.log('waiting 15 seconds before trying again')
                await wait(15 * 1000)
              }
            }
            resolve(null)
          })
        )
      }
      await Promise.all(promises)
      count++
    }

    logger.info('transactions:', transactions)
    logger.debug('waiting for bonded withdrawal events')
    const transferIds: any = {}
    const poll = async (): Promise<any> => {
      let cache: any = {}
      const chains = paths[0]
      for (let chain of chains) {
        if (!cache[chain]) {
          cache[chain] = {}
        }
        cache[chain].transferSents = await this.fetchTransferSents(chain)
        cache[chain].withdrawalBondeds = await this.fetchBondedWithdrawals(
          chain
        )
      }
      for (let chain in transactions) {
        for (let txHash of transactions[chain]) {
          const match = cache[chain].transferSents.find(
            (x: any) => x.transactionHash === txHash
          )
          if (!match) {
            continue
          }
          const { transferId, destinationChainId } = match
          transferIds[txHash] = transferId
          bonded[txHash] = !!cache[
            chainIdToSlug(destinationChainId)
          ]?.withdrawalBondeds.find((x: any) => x.transferId === transferId)
        }
      }
      const items = Object.values(bonded)
      const allBonded =
        items.length &&
        items.length === transferIds.length &&
        items.every(x => x)
      logger.debug('bonded:', bonded)
      if (allBonded) {
        logger.debug('success')
        return
      }
      await wait(10 * 1000)
      return poll()
    }

    await poll()
  }

  async fetchTransferSents (chain: string) {
    const queryL2 = `
      query TransferSents {
        transferSents(
          orderBy: timestamp,
          orderDirection: desc
        ) {
          transferId
          destinationChainId
          amount
          transactionHash
          timestamp
        }
      }
    `
    const queryL1 = `
      query TransferSentToL2 {
        transferSents: transferSentToL2S(
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id
          destinationChainId
          amount
          transactionHash
          timestamp
        }
      }
    `
    let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
    let query = queryL1
    if (chain !== 'mainnet') {
      url = `${url}-${chain}`
      query = queryL2
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    })
    const jsonRes = await res.json()
    return jsonRes.data.transferSents.map((x: any) => {
      x.destinationChainId = Number(x.destinationChainId)
      return x
    })
  }

  async fetchBondedWithdrawals (chain: string) {
    const query = `
      query WithdrawalBondeds {
        withdrawalBondeds(
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id
          transferId
          transactionHash
        }
      }
    `
    let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
    if (chain !== 'mainnet') {
      url = `${url}-${chain}`
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    })
    const jsonRes = await res.json()
    return jsonRes.data.withdrawalBondeds
  }
}

export default LoadTest
