import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react'
import { Contract } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Transaction from 'src/models/Transaction'
import Token from 'src/models/Token'
import logger from 'src/logger'

type FaucetContextProps = {
  mintToken: () => void
  mintAmount: string
  isMinting: boolean
  claimTokens: () => void
  isClaiming: boolean
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: () => {},
  mintAmount: '',
  isMinting: false,
  claimTokens: () => {},
  isClaiming: false,
  error: null,
  setError: (error: string | null | undefined) => {}
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount, setMintAmount] = useState<string>('10')
  const [isMinting, setMinting] = useState<boolean>(false)
  const [isClaiming, setClaiming] = useState<boolean>(false)
  let { contracts, txHistory, networks, tokens } = useApp()
  const token = tokens.find(token => token.symbol === 'DAI') as Token
  const l1Dai = contracts?.tokens[token.symbol].kovan.l1CanonicalToken
  const { address, getWriteContract } = useWeb3Context()
  const selectedNetwork = networks[0]
  const [error, setError] = useState<string | null | undefined>(null)

  const mintToken = async () => {
    try {
      let l1DaiWrite
      l1DaiWrite = await getWriteContract(l1Dai)
      if (!l1DaiWrite) {
        return
      }
      setMinting(true)
      const recipient = address?.toString()
      const parsedAmount = parseUnits(mintAmount, 18)

      const tx = await l1DaiWrite?.mint(recipient, parsedAmount)
      logger.debug('mint:', tx?.hash)

      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: 'kovan'
        })
      )
      await tx?.wait()
    } catch (err) {
      setError(err.message)
      logger.error(err)
    }
    setMinting(false)
  }

  const claimTokens = async () => {
    try {
      setClaiming(true)
      const sourceTokenContracts = contracts?.tokens['DAI']
      const l1TokenAddress =
        sourceTokenContracts?.kovan.l1CanonicalToken.address
      const l1Messenger = sourceTokenContracts?.xdai.l1CanonicalBridge
      const l1MessengerWrite = await getWriteContract(l1Messenger)
      const tx = await l1MessengerWrite?.claimTokens(
        l1TokenAddress,
        address?.toString()
      )
      logger.debug('claim:', tx?.hash)

      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: 'kovan'
        })
      )
      await tx?.wait()
    } catch (err) {
      setError(err.message)
      logger.error(err)
    }
    setClaiming(false)
  }

  return (
    <FaucetContext.Provider
      value={{
        mintToken,
        mintAmount,
        isMinting,
        claimTokens,
        isClaiming,
        error,
        setError
      }}
    >
      {children}
    </FaucetContext.Provider>
  )
}

export const useFaucet = () => useContext(FaucetContext)

export default FaucetContextProvider
