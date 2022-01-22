import React, { FC, createContext, useContext, useState } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Transaction from 'src/models/Transaction'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { L1_NETWORK } from 'src/utils/constants'
import { formatError } from 'src/utils/format'
import { l1Network } from 'src/config/networks'

type FaucetContextProps = {
  mintToken: () => void
  mintAmount: string
  isMinting: boolean
  tokens: Token[]
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
  selectedNetwork: Network
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: () => {},
  mintAmount: '',
  isMinting: false,
  tokens: [],
  error: null,
  setError: (error: string | null | undefined) => {},
  selectedNetwork: l1Network,
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount] = useState<string>('1000')
  const [isMinting, setMinting] = useState<boolean>(false)
  const { contracts, txHistory, networks, tokens } = useApp()
  const { address, getWriteContract } = useWeb3Context()
  const selectedNetwork = l1Network
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(tokens[0])
  const [error, setError] = useState<string | null | undefined>(null)

  const mintToken = async () => {
    try {
      if (!selectedToken?.symbol) {
        return
      }
      const contract = contracts?.tokens[selectedToken.symbol][L1_NETWORK].l1CanonicalToken
      const writeContract = await getWriteContract(contract)
      if (!writeContract) {
        return
      }
      setMinting(true)
      const recipient = address?.toString()
      const parsedAmount = parseUnits(mintAmount, selectedToken.decimals)

      const tx = await writeContract?.mint(recipient, parsedAmount)
      logger.debug('mint:', tx?.hash)

      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: L1_NETWORK,
        })
      )
      await tx?.wait()
    } catch (err: any) {
      setError(formatError(err, selectedNetwork))
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
        selectedNetwork,
        tokens,
        error,
        setError,
      }}
    >
      {children}
    </FaucetContext.Provider>
  )
}

export const useFaucet = () => useContext(FaucetContext)

export default FaucetContextProvider
