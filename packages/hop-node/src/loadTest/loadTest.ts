import Logger from 'src/logger'
import getBondedWithdrawals from 'src/theGraph/getBondedWithdrawals'
import getTransferSents from 'src/theGraph/getTransferSents'
import { Chain } from 'src/constants'
import { Notifier } from 'src/notifier'
import {
  User,
  generateUser,
  generateUsers,
  prepareAccounts
} from '../../test/helpers'
import { chainIdToSlug, wait } from 'src/utils'
import {
  faucetPrivateKey,
  mnemonic,
  privateKey as testUserPrivateKey
} from '../../test/config'
import { config as globalConfig } from 'src/config'

const useTestUserPrivateKey = false

type Config = {
  concurrentUsers: number
  iterations: number
  amount: number
  paths: string[][]
  token: string
}

class LoadTest {
  concurrentUsers: number = 1
  iterations: number = 1
  amount: number = 0.1
  token: string = 'USDC'
  paths: string[][] = []

  constructor (config: Config) {
    if (config.concurrentUsers) {
      this.concurrentUsers = config.concurrentUsers
    }
    if (config.iterations) {
      this.iterations = config.iterations
    }
    if (config.amount) {
      this.amount = config.amount
    }
    if (config.token) {
      this.token = config.token
    }
    if (config.paths) {
      this.paths = config.paths
    }
  }

  async start () {
    const logger = new Logger({
      tag: 'LoadTest'
    })
    const transactions: any = {}
    const amounts: any = {}
    const bonded: any = {}
    const transferAmount = this.amount
    const paths = this.paths
    const tokens = [this.token]

    logger.debug('concurrent users:', this.concurrentUsers)
    logger.debug('iterations:', this.iterations)
    logger.debug('transfer amount:', transferAmount)
    logger.debug('tokens:', tokens)
    logger.debug('paths', paths)

    if (!paths.length) {
      throw new Error('paths is required')
    }

    if (!mnemonic) {
      throw new Error('mnemonic is required')
    }

    let count = 0
    let failedIndex = -1
    let failedTxHash = ''
    while (count < this.iterations) {
      const promises: Promise<any>[] = []
      for (const path of paths) {
        const sourceNetwork = path[0]
        const destNetwork = path[1]
        const validChains = Object.values(Chain) as string[]
        if (!validChains.includes(sourceNetwork)) {
          throw new Error(`the chain "${sourceNetwork}" is not supported`)
        }
        if (!validChains.includes(destNetwork)) {
          throw new Error(`the chain "${sourceNetwork}" is not supported`)
        }
        if (!transactions[sourceNetwork]) {
          transactions[sourceNetwork] = []
        }
        if (!amounts[sourceNetwork]) {
          amounts[sourceNetwork] = []
        }
        promises.push(
          new Promise(async (resolve, reject) => {
            for (const token of tokens) {
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
                for (const i in users) {
                  logger.debug(`#${i} account: ${await users[i].getAddress()}`)
                }
                const faucetTokensToSend = transferAmount
                await prepareAccounts(
                  users,
                  faucet,
                  token,
                  sourceNetwork,
                  faucetTokensToSend
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

                logger.log('cohort sent')
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
    if (!globalConfig.isMainnet) {
      logger.warn(
        'skipping check due to the hop subgraph currently only supporting mainnet network'
      )
      return
    }
    const transferIds: any = {}
    const poll = async (): Promise<any> => {
      const cache: any = {}
      const chains = Array.from(
        new Set((paths as any).flat()).values()
      ) as string[]
      for (const chain of chains) {
        if (!cache[chain]) {
          cache[chain] = {}
        }
        cache[chain].transferSents = await getTransferSents(chain, this.token)
        cache[chain].withdrawalBondeds = await getBondedWithdrawals(chain, this.token)
      }
      for (const chain in transactions) {
        for (const txHash of transactions[chain]) {
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
        items.length === Object.keys(transferIds).length &&
        items.every(x => x)
      if (allBonded) {
        logger.debug('success')
        return
      }
      await wait(10 * 1000)
      return poll()
    }

    await poll()
  }
}

export default LoadTest
