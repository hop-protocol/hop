import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import promiseTimeout from 'src/utils/promiseTimeout'

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
  error?: boolean
  url?: string
}

const StatusContextProvider: FC = ({ children }) => {
  let { sdk } = useApp()
  let [steps, setSteps] = useState<Step[]>([])
  let [activeStep, setActiveStep] = React.useState(0)
  const [fetching, setFetching] = useState<boolean>(false)
  const [tx, setTx] = useState<Transaction | null>(null)
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
    if (activeStep < 2) {
      setActiveStep(1)
    }
    const sourceChain = sdk.Chain.fromSlug(tx.networkName)
    const destChain = sdk.Chain.fromSlug(tx.destNetworkName as string)
    if (!sourceChain) {
      return false
    }
    let currentSteps: Step[] = [
      {
        text: 'Initiated'
      },
      { text: sourceChain.name, url: tx.explorerLink }
    ]
    sdk
      .watch(tx.hash, tx.token.symbol, sourceChain, destChain)
      .on(sdk.Event.SourceTxReceipt, data => {
        const { receipt } = data
        if (!receipt.status) {
          currentSteps[1].text = 'Unsuccessful'
          currentSteps[1].error = true
        }
        if (activeStep < 3) {
          setActiveStep(2)
        }
      })
      .on(sdk.Event.DestinationTxReceipt, data => {
        const { receipt } = data
        const error = !receipt.status
        if (currentSteps.length < 3 && steps.length < 3) {
          currentSteps.push({
            text: destChain?.name as string
          })
          setSteps([...currentSteps])
        }
        const destTxObj = new Transaction({
          hash: receipt.transactionHash,
          networkName: destChain?.slug as string
        })
        currentSteps[2].url = destTxObj.explorerLink
        if (error) {
          currentSteps[2].text = 'Unsuccessful'
          currentSteps[2].error = true
        }
        if (steps.length < 4) {
          setSteps([...currentSteps])
        }
        if (activeStep < 4) {
          setActiveStep(3)
        }
      })

    if (destChain) {
      currentSteps.push({ text: destChain.name })
    }
    if (steps.length < 3) {
      setSteps([...currentSteps])
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

    return () => {}
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
