import React, { FC, createContext, useContext, useState } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Transaction from 'src/models/Transaction'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { L1_NETWORK } from 'src/constants'

type FaucetContextProps = {
  mintToken: () => void
  mintAmount: string
  isMinting: boolean
  selectedToken: Token | undefined
  setSelectedToken: (token: Token) => void
  tokens: Token[]
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
  selectedNetwork: Network | undefined
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: () => {},
  mintAmount: '',
  isMinting: false,
  selectedToken: undefined,
  setSelectedToken: (token: Token) => {},
  tokens: [],
  error: null,
  setError: (error: string | null | undefined) => {},
  selectedNetwork: undefined
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount] = useState<string>('10')
  const [isMinting, setMinting] = useState<boolean>(false)
  let { contracts, txHistory, networks, tokens } = useApp()
  const { address, getWriteContract } = useWeb3Context()
  const selectedNetwork = networks[0]
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    tokens[0]
  )
  const [error, setError] = useState<string | null | undefined>(null)

  const mintToken = async () => {
    try {
      if (!selectedToken?.symbol) {
        return
      }
      const contract =
        contracts?.tokens[selectedToken.symbol][L1_NETWORK].l1CanonicalToken
      const writeContract = await getWriteContract(contract)
      if (!writeContract) {
        return
      }
      setMinting(true)
      const recipient = address?.toString()
      const parsedAmount = parseUnits(mintAmount, 18)

      const tx = await writeContract?.mint(recipient, parsedAmount)
      logger.debug('mint:', tx?.hash)

      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: L1_NETWORK
        })
      )
      await tx?.wait()
    } catch (err) {
      setError(err.message)
      logger.error(err)
    }
    setMinting(false)
  }

  return (
    <FaucetContext.Provider
      value={{
        mintToken,
        mintAmount,
        isMinting,
        selectedToken,
        setSelectedToken,
        selectedNetwork,
        tokens,
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
