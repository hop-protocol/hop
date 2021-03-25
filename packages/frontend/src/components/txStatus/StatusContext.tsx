import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { ethers, Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Address from 'src/models/Address'
import Transaction from 'src/models/Transaction'
import Transfer from 'src/models/Transfer'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { wait, networkIdToSlug } from 'src/utils'
import promiseTimeout from 'src/utils/promiseTimeout'
import { L1_NETWORK } from 'src/constants'

type StatusContextProps = {
  steps: any[]
  activeStep: number
  fetching: boolean
  setTx: (tx: Transaction) => void
}

const StatusContext = createContext<StatusContextProps>({
  steps: [],
  activeStep: 0,
  fetching: false,
  setTx: (tx: Transaction) => {}
})

type Step = {
  text: string
  url?: string
}

const StatusContextProvider: FC = ({ children }) => {
  let { networks, tokens, contracts, txHistory } = useApp()
  let [steps, setSteps] = useState<Step[]>([])
  let [activeStep, setActiveStep] = React.useState(0)
  const [fetching, setFetching] = useState<boolean>(false)
  const [tx, setTx] = useState<Transaction | null>(null)
  const l1Provider = contracts?.providers[L1_NETWORK]
  const cacheKey = `txStatus:${tx?.hash}`

  useEffect(() => {
    if (!tx) {
      return
    }
    try {
      const res = { activeStep, steps }
      localStorage.setItem(cacheKey, JSON.stringify(res))
    } catch (err) {
      logger.error(err)
    }
  }, [activeStep, steps])

  async function updateStatus (activeStep: number = 0, steps: Step[] = []) {
    if (!tx) return
    if (!tx.token) return
    const token = tx.token
    const l1Bridge = contracts?.tokens[token?.symbol][L1_NETWORK].l1Bridge
    if (activeStep < 2) {
      setActiveStep(1)
    }
    const sourceNetwork = networks.find(
      network => network.slug === tx.networkName
    )
    let destNetwork = networks.find(
      network => network.slug === tx.destNetworkName
    )
    if (!sourceNetwork) {
      return false
    }
    let currentSteps: Step[] = [
      {
        text: 'Initiated'
      },
      { text: sourceNetwork.name, url: tx.explorerLink }
    ]
    if (destNetwork) {
      currentSteps.push({ text: destNetwork.name })
    }
    if (steps.length < 3) {
      setSteps([...currentSteps])
    }
    const receipt = await tx.receipt()
    if (!receipt.status) {
      throw new Error('Transaction failed')
    }
    const sourceTx = await tx.getTransaction()
    if (activeStep < 3) {
      setActiveStep(2)
    }

    const sourceBlock = await l1Bridge?.provider.getBlock(
      sourceTx.blockNumber as number
    )
    const sourceTimestamp = sourceBlock?.timestamp

    // L1 -> L2
    if (sourceNetwork.isLayer1) {
      const decodedSource = l1Bridge?.interface.decodeFunctionData(
        'sendToL2',
        sourceTx.data
      )
      const networkId = decodedSource?.chainId
      const destSlug = networkIdToSlug(networkId)
      destNetwork = networks.find(network => network.slug === destSlug)
      if (currentSteps.length < 3 && steps.length < 3) {
        currentSteps.push({ text: destNetwork?.name as string })
        setSteps([...currentSteps])
      }
      const bridge = contracts?.tokens[token.symbol][destSlug].l2Bridge
      const exchange = contracts?.tokens[token.symbol][destSlug].uniswapExchange
      const pollDest = async () => {
        const blockNumber = await bridge?.provider.getBlockNumber()
        if (!blockNumber) {
          return false
        }
        let recentLogs: any[] =
          (await exchange?.queryFilter(
            exchange.filters.Swap(),
            (blockNumber as number) - 100
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          if (sourceTx.from === decodedLog.to) {
            if (
              decodedSource?.amount.toString() !==
              decodedLog.amount0In.toString()
            ) {
              continue
            }
            if (!sourceTimestamp) {
              continue
            }
            const destTx = await item.getTransaction()
            const destTxObj = new Transaction({
              hash: destTx.hash,
              networkName: destNetwork?.slug as string
            })
            currentSteps[2].url = destTxObj.explorerLink
            if (steps.length < 4) {
              setSteps([...currentSteps])
            }
            const destBlock = await bridge?.provider.getBlock(
              destTx.blockNumber
            )
            if (!destBlock) {
              continue
            }
            if (destBlock.timestamp - sourceTimestamp < 500) {
              if (activeStep < 4) {
                setActiveStep(3)
              }
              return true
            }
          }
          return false
        }
        return false
      }
      if (activeStep !== 3) {
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }
    }

    // L2 -> L1
    if (!sourceNetwork.isLayer1 && destNetwork?.isLayer1) {
      const sourceSlug = sourceNetwork.slug
      const wrapper =
        contracts?.tokens[token.symbol][sourceSlug].l2UniswapWrapper
      const decodedSource = wrapper?.interface.decodeFunctionData(
        'swapAndSend',
        sourceTx.data
      )
      const networkId = destNetwork?.networkId
      let transferHash: string = ''
      for (let log of receipt.logs) {
        const transferSentTopic =
          '0x6ea037b8ea9ecdf62eae513fc0f331de4e4a9df62927a789d840281438d14ce5'
        if (log.topics[0] === transferSentTopic) {
          transferHash = log.topics[1]
        }
      }
      if (!transferHash) {
        return false
      }
      const pollDest = async () => {
        const blockNumber = await l1Bridge?.provider.getBlockNumber()
        if (!blockNumber) {
          return false
        }
        let recentLogs: any[] =
          (await l1Bridge?.queryFilter(
            l1Bridge.filters.WithdrawalBonded(),
            (blockNumber as number) - 100
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }
        for (let item of recentLogs) {
          if (item.topics[1] === transferHash) {
            const destTx = await item.getTransaction()
            const destTxObj = new Transaction({
              hash: destTx.hash,
              networkName: destNetwork?.slug as string
            })
            currentSteps[2].url = destTxObj.explorerLink
            if (steps.length < 4) {
              setSteps([...currentSteps])
            }
            if (activeStep < 4) {
              setActiveStep(3)
            }
            return true
          }
        }
        return false
      }
      if (activeStep !== 3) {
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }
    }

    // L2 -> L2
    if (!sourceNetwork.isLayer1 && !destNetwork?.isLayer1) {
      if (!destNetwork) {
        return
      }
      const sourceSlug = sourceNetwork.slug
      const destSlug = destNetwork?.slug
      const wrapperSource =
        contracts?.tokens[token.symbol][sourceSlug].l2UniswapWrapper
      const wrapperDest =
        contracts?.tokens[token.symbol][destSlug].l2UniswapWrapper
      const exchange = contracts?.tokens[token.symbol][destSlug].uniswapExchange
      const bridge = contracts?.tokens[token.symbol][destSlug].l2Bridge
      const decodedSource = wrapperSource?.interface.decodeFunctionData(
        'swapAndSend',
        sourceTx.data
      )
      let transferHash: string = ''
      for (let log of receipt.logs) {
        const transferSentTopic =
          '0x6ea037b8ea9ecdf62eae513fc0f331de4e4a9df62927a789d840281438d14ce5'
        if (log.topics[0] === transferSentTopic) {
          transferHash = log.topics[1]
          break
        }
      }
      if (!transferHash) {
        return false
      }
      const pollDest = async () => {
        const blockNumber = await bridge?.provider.getBlockNumber()
        if (!blockNumber) {
          return false
        }
        let recentLogs: any[] =
          (await exchange?.queryFilter(
            exchange.filters.Swap(),
            (blockNumber as number) - 100
          )) ?? []
        recentLogs = recentLogs.reverse()
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          if (sourceTx.from === decodedLog.to) {
            /*
            if (
              decodedSource?.amount.toString() !==
              decodedLog.amount0In.toString()
            ) {
              continue
            }
             */
            if (!sourceTimestamp) {
              continue
            }
            const destTx = await item.getTransaction()
            const destTxObj = new Transaction({
              hash: destTx.hash,
              networkName: destNetwork?.slug as string
            })
            currentSteps[2].url = destTxObj.explorerLink
            if (steps.length < 4) {
              setSteps([...currentSteps])
            }
            const destBlock = await bridge?.provider.getBlock(
              destTx.blockNumber
            )
            if (!destBlock) {
              continue
            }
            //if ((destBlock.timestamp - sourceTimestamp) < 500) {
            if (activeStep < 4) {
              setActiveStep(3)
            }
            return true
            //}
          }
          return false
        }
        return false
      }
      if (activeStep !== 3) {
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }
    }
  }

  useEffect(() => {
    const update = async () => {
      if (!tx) {
        return
      }

      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const res = JSON.parse(cached)
          if (res) {
            activeStep = res.activeStep
            steps = res.steps
            setActiveStep(activeStep)
            setSteps(steps)
          }
        }
      } catch (err) {
        logger.error(err)
      }

      setFetching(true)
      await promiseTimeout(updateStatus(activeStep, steps), 120 * 1000)
      setFetching(false)
    }

    update().catch(logger.error)
  }, [tx])

  return (
    <StatusContext.Provider
      value={{
        fetching,
        steps,
        activeStep,
        setTx
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export const useStatus = () => useContext(StatusContext)

export default StatusContextProvider
