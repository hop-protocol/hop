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

type StatusContextProps = {
  steps: any[]
  activeStep: number
  fetching: boolean
}

const StatusContext = createContext<StatusContextProps>({
  steps: [],
  activeStep: 0,
  fetching: false
})

const StatusContextProvider: FC = ({ children }) => {
  let { networks, tokens, contracts, txHistory } = useApp()
  const [steps, setSteps] = useState<any[]>([])
  const [activeStep, setActiveStep] = React.useState(0)
  const [fetching, setFetching] = useState<boolean>(false)
  const [tx, setTx] = useState<Transaction | null>(null)
  const l1Provider = contracts?.l1Provider
  const l1Bridge = contracts?.l1Bridge

  async function updateStatus () {
    if (!tx) return
    setActiveStep(1)
    const sourceNetwork = networks.find(
      network => network.slug === tx.networkName
    )
    let destNetwork = networks.find(
      network => network.slug === tx.destNetworkName
    )
    if (!sourceNetwork) {
      return false
    }
    if (destNetwork) {
      setSteps(['Initiated', sourceNetwork.name, destNetwork?.name])
    } else {
      setSteps(['Initiated', sourceNetwork.name])
    }
    const receipt = await tx.receipt()
    const sourceTx = await tx.getTransaction()
    setActiveStep(2)

    const sourceBlock = await l1Bridge?.provider.getBlock(
      sourceTx.blockNumber as number
    )
    const sourceTimestamp = sourceBlock?.timestamp

    // L1 -> L2
    if (sourceNetwork.isLayer1) {
      const decodedSource = l1Bridge?.interface.decodeFunctionData(
        'sendToL2AndAttemptSwap',
        sourceTx.data
      )
      const networkId = decodedSource?._chainId
      const destSlug = networkIdToSlug[networkId]
      destNetwork = networks.find(network => network.slug === destSlug)
      setSteps(['Initiated', sourceNetwork?.name, destNetwork?.name])
      const bridge = contracts?.networks[destSlug].l2Bridge
      const exchange = contracts?.networks[destSlug].uniswapExchange
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
              decodedSource?._amount.toString() !==
              decodedLog.amount1In.toString()
            ) {
              continue
            }
            if (!sourceTimestamp) {
              continue
            }
            const destTx = await item.getTransaction()
            const destBlock = await bridge?.provider.getBlock(
              destTx.blockNumber
            )
            if (!destBlock) {
              continue
            }
            if (destBlock.timestamp - sourceTimestamp < 500) {
              setActiveStep(3)
              return true
            }
          }
          return false
        }
        return false
      }
      let res = false
      while (!res) {
        res = await pollDest()
        await wait(5e3)
      }
    }

    // L2 -> L1
    if (!sourceNetwork.isLayer1 && destNetwork?.isLayer1) {
      const sourceSlug = sourceNetwork.slug
      const bridge = contracts?.networks[sourceSlug].l2Bridge
      const decodedSource = bridge?.interface.decodeFunctionData(
        'swapAndSend',
        sourceTx.data
      )
      const networkId = decodedSource?._chainId
      let transferHash: string = ''
      for (let log of receipt.logs) {
        const transferSentTopic =
          '0x30184d17358bc1e4120ae52a274a8279c1c0258108596a2c24c87123a347132c'
        if (log.topics[0] === transferSentTopic) {
          transferHash = log.topics[1]
          if (!transferHash) {
            const decodedLog = bridge?.interface.decodeEventLog(
              'TransferSent',
              log.data
            )
            transferHash = decodedLog?.transferHash
          }
          break
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
            l1Bridge.filters.TransferRootBonded(),
            (blockNumber as number) - 100
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          const transferRoot = decodedLog.root
          if (transferRoot === transferHash) {
            setActiveStep(3)
            return true
          }
        }
        return false
      }
      let res = false
      while (!res) {
        res = await pollDest()
        await wait(5e3)
      }
    }

    // L2 -> L2
    if (!sourceNetwork.isLayer1 && !destNetwork?.isLayer1) {
      const sourceSlug = sourceNetwork.slug
      const bridge = contracts?.networks[sourceSlug].l2Bridge
      const decodedSource = bridge?.interface.decodeFunctionData(
        'swapAndSend',
        sourceTx.data
      )
      const networkId = decodedSource?._chainId
      let transferHash: string = ''
      for (let log of receipt.logs) {
        const transferSentTopic =
          '0x30184d17358bc1e4120ae52a274a8279c1c0258108596a2c24c87123a347132c'
        if (log.topics[0] === transferSentTopic) {
          transferHash = log.topics[1]
          if (!transferHash) {
            const decodedLog = bridge?.interface.decodeEventLog(
              'TransferSent',
              log.data
            )
            transferHash = decodedLog?.transferHash
          }
          break
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
            l1Bridge.filters.TransferRootBonded(),
            (blockNumber as number) - 100
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          const transferRoot = decodedLog.root
          if (transferRoot === transferHash) {
            setActiveStep(3)
            return true
          }
        }
        return false
      }
      let res = false
      while (!res) {
        res = await pollDest()
        await wait(5e3)
      }
    }
  }

  useEffect(() => {
    if (!txHistory?.transactions || !txHistory?.transactions.length) {
      return
    }
    const recent = txHistory?.transactions[0]
    if (recent.hash !== tx?.hash) {
      setTx(recent)
    }
  }, [txHistory?.transactions])

  useEffect(() => {
    const update = async () => {
      if (!tx) {
        return
      }
      setFetching(true)
      await updateStatus()
      setFetching(false)
    }

    update().catch(logger.error)
  }, [tx])

  return (
    <StatusContext.Provider
      value={{
        fetching,
        steps,
        activeStep
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export const useStatus = () => useContext(StatusContext)

export default StatusContextProvider
