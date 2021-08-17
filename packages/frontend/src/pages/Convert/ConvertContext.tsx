import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  ReactNode
} from 'react'
import { BigNumber, Signer } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { useLocation } from 'react-router-dom'
import { HopBridge, Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { UINT256 } from 'src/constants'
import logger from 'src/logger'
import ConvertOption from 'src/pages/Convert/ConvertOption/ConvertOption'
import AmmConvertOption from 'src/pages/Convert/ConvertOption/AmmConvertOption'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import useBalance from 'src/hooks/useBalance'
import { toTokenDisplay } from 'src/utils'
import useApprove from 'src/hooks/useApprove'

type ConvertContextProps = {
  convertOptions: ConvertOption[]
  convertOption: ConvertOption | undefined
  networks: Network[]
  l2Networks: Network[]
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network | undefined) => void
  sourceNetwork: Network | undefined
  destNetwork: Network | undefined
  sourceToken: Token | undefined
  destToken: Token | undefined
  sourceTokenAmount: string | undefined
  setSourceTokenAmount: (value: string) => void
  destTokenAmount: string | undefined
  setDestTokenAmount: (value: string) => void
  convertTokens: () => void
  validFormFields: boolean
  sending: boolean
  sendButtonText: string
  sourceBalance: BigNumber | undefined
  loadingSourceBalance: boolean
  destBalance: BigNumber | undefined
  loadingDestBalance: boolean
  switchDirection: () => void
  details: ReactNode | undefined
  warning: ReactNode | undefined
  error: string | undefined
  setError: (error: string | undefined) => void
  tx: Transaction | undefined
  setTx: (tx: Transaction | undefined) => void
}

const ConvertContext = createContext<ConvertContextProps>({
  convertOptions: [],
  convertOption: undefined,
  networks: [],
  l2Networks: [],
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network | undefined) => {},
  sourceNetwork: undefined,
  destNetwork: undefined,
  sourceToken: undefined,
  destToken: undefined,
  sourceTokenAmount: undefined,
  setSourceTokenAmount: (value: string) => {},
  destTokenAmount: undefined,
  setDestTokenAmount: (value: string) => {},
  convertTokens: () => {},
  validFormFields: false,
  sending: false,
  sendButtonText: '',
  sourceBalance: undefined,
  loadingSourceBalance: false,
  destBalance: undefined,
  loadingDestBalance: false,
  switchDirection: () => {},
  details: [],
  warning: undefined,
  error: undefined,
  setError: (error: string | undefined) => {},
  tx: undefined,
  setTx: (tx: Transaction | undefined) => {},
})

const ConvertContextProvider: FC = ({ children }) => {
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const app = useApp()
  const { networks, selectedBridge, txConfirm, sdk, l1Network, settings } = app
  const { slippageTolerance, deadline } = settings
  const { pathname } = useLocation()

  const convertOptions = useMemo(() => {
    return [
      new AmmConvertOption(),
      new HopConvertOption()
    ]
  }, [])
  const convertOption = useMemo(() => {
    return convertOptions.find(option =>
      pathname.includes(option.path)
    ) || convertOptions[0]
  }, [pathname])
  const l2Networks = networks.filter((network: Network) => !network.isLayer1)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    l2Networks[0]
  )
  const [isForwardDirection, setIsForwardDirection] = useState(true)
  const switchDirection = () => {
    setIsForwardDirection(!isForwardDirection)
  }
  const sourceNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || !isForwardDirection) {
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])
  const destNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || isForwardDirection) {
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [amountOutMin, setAmountOutMin] = useState<BigNumber>()
  const [sending, setSending] = useState<boolean>(false)

  const [sourceToken, setSourceToken] = useState<Token>()
  const [destToken, setDestToken] = useState<Token>()

  useEffect(() => {
    const fetchToken = async () => {
      let token = await convertOption.sourceToken(isForwardDirection, selectedNetwork, selectedBridge)
      if (token?.isNativeToken) {
        token = token.getWrappedToken()
      }
      setSourceToken(token)
    }

    fetchToken()
  }, [convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  useEffect(() => {
    const fetchToken = async () => {
      const token = await convertOption.destToken(isForwardDirection, selectedNetwork, selectedBridge)
      setDestToken(token)
    }

    fetchToken()
  }, [convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  const { balance: sourceBalance, loading: loadingSourceBalance } = useBalance(
    sourceToken,
    sourceNetwork,
    address
  )
  const { balance: destBalance, loading: loadingDestBalance } = useBalance(
    destToken,
    destNetwork,
    address
  )
  const [details, setDetails] = useState<ReactNode>()
  const [warning, setWarning] = useState<ReactNode>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()
  const debouncer = useRef(0)

  const parsedSourceTokenAmount = useMemo(() => {
    if (!sourceTokenAmount || !sourceToken) {
      return BigNumber.from(0)
    }

    return parseUnits(
      sourceTokenAmount,
      sourceToken.decimals
    )
  }, [sourceTokenAmount, sourceToken])

  useEffect(() => {
    const getSendData = async () => {
      setError(undefined)
      if (
        !selectedBridge ||
        !sourceTokenAmount ||
        !sourceNetwork ||
        !destNetwork ||
        !sourceToken
      ) {
        setDestTokenAmount('')
        return
      }

      const ctx = ++debouncer.current

      const {
        amountOut,
        details,
        warning,
        bonderFee
      } = await convertOption.getSendData(
        sdk,
        sourceNetwork,
        destNetwork,
        isForwardDirection,
        selectedBridge.getTokenSymbol(),
        parsedSourceTokenAmount
      )

      let formattedAmount = ''
      if (amountOut) {
        formattedAmount = toTokenDisplay(amountOut, sourceToken.decimals)
      }

      let _amountOutMin
      if (amountOut) {
        // amountOutMin only used for AMM option
        const slippageToleranceBps = slippageTolerance * 100
        const minBps = Math.ceil(10000 - slippageToleranceBps)
        _amountOutMin = amountOut.mul(minBps).div(10000)
      }

      if (ctx !== debouncer.current) return

      setDestTokenAmount(formattedAmount)
      setAmountOutMin(_amountOutMin)
      setDetails(details)
      setWarning(warning)
      setBonderFee(bonderFee)
    }

    getSendData()
  }, [sourceTokenAmount, selectedBridge, selectedNetwork, convertOption, isForwardDirection])

  const approve = useApprove()
  const approveTokens = async (): Promise<any> => {
    if (!sourceToken) {
      throw new Error('No source token selected')
    }

    const targetAddress = await convertOption.getTargetAddress(
      sdk,
      selectedBridge?.getTokenSymbol(),
      sourceNetwork,
      destNetwork
    )

    const tx = await approve(parsedSourceTokenAmount, sourceToken, targetAddress)

    await tx?.wait()
    return tx
  }

  const convertTokens = async () => {
    try {
      setTx(undefined)
      const networkId = Number(sourceNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(undefined)
      if (
        !Number(sourceTokenAmount) ||
        !sourceNetwork ||
        !destNetwork ||
        !sourceToken ||
        !selectedBridge
      ) {
        return
      }

      setSending(true)

      const signer = provider?.getSigner()
      const value = parseUnits(
        sourceTokenAmount,
        sourceToken.decimals
      ).toString()
      const l1Bridge = await selectedBridge.getL1Bridge()
      const isCanonicalTransfer = false

      const tx = await txConfirm?.show({
        kind: 'convert',
        inputProps: {
          source: {
            amount: sourceTokenAmount,
            token: sourceToken
          },
          dest: {
            amount: destTokenAmount,
            token: destToken
          }
        },
        onConfirm: async () => {
          await approveTokens()

          if (
            !selectedBridge ||
            !signer ||
            !sourceToken ||
            !amountOutMin
          ) {
            throw new Error('Missing convert param')
          }

          return convertOption.convert(
            sdk,
            signer,
            sourceNetwork,
            destNetwork,
            isForwardDirection,
            selectedBridge.getTokenSymbol(),
            value,
            amountOutMin,
            deadline(),
            bonderFee
          )
        }
      })

      if (tx?.hash && sourceNetwork?.name) {
        const txObj = new Transaction({
            hash: tx?.hash,
            networkName: sourceNetwork.slug,
            destNetworkName: destNetwork.slug,
            token: sourceToken,
            isCanonicalTransfer
          })
        // don't set tx status modal if it's tx to the same chain
        if (sourceNetwork.isLayer1 !== destNetwork?.isLayer1) {
          setTx(txObj)
        }
        app?.txHistory?.addTransaction(
          txObj
        )
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  const enoughBalance = sourceBalance?.gte(parsedSourceTokenAmount)
  const withinMax = true
  let sendButtonText = 'Convert'
  const validFormFields = !!(
    sourceTokenAmount &&
    destTokenAmount &&
    enoughBalance &&
    withinMax
  )
  if (sourceBalance === undefined) {
    sendButtonText = 'Fetching balance...'
  } else if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  return (
    <ConvertContext.Provider
      value={{
        convertOptions,
        convertOption,
        networks,
        l2Networks,
        selectedNetwork,
        setSelectedNetwork,
        sourceNetwork,
        destNetwork,
        sourceToken,
        destToken,
        sourceTokenAmount,
        setSourceTokenAmount,
        destTokenAmount,
        setDestTokenAmount,
        convertTokens,
        validFormFields,
        sending,
        sendButtonText,
        sourceBalance,
        loadingSourceBalance,
        destBalance,
        loadingDestBalance,
        switchDirection,
        details,
        warning,
        error,
        setError,
        tx,
        setTx
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
