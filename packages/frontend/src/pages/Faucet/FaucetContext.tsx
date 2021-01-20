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

type FaucetContextProps = {
  mintToken: () => void
  mintAmount: string
  isMinting: boolean
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: () => {},
  mintAmount: '',
  isMinting: false
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount, setMintAmount] = useState<string>('10')
  const [isMinting, setMinting] = useState<boolean>(false)
  let { contracts, txHistory } = useApp()
  const l1Dai = contracts?.l1Dai
  const { address } = useWeb3Context()

  const mintToken = async () => {
    try {
      setMinting(true)
      const recipient = address?.toString()
      const parsedAmount = parseUnits(mintAmount, 18)
      const tx = await l1Dai?.mint(recipient, parsedAmount)
      console.log(tx?.hash)
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: 'kovan'
        })
      )
      await tx?.wait()
    } catch (err) {
      alert(err.message)
      console.error(err)
    }
    setMinting(false)
  }

  return (
    <FaucetContext.Provider
      value={{
        mintToken,
        mintAmount,
        isMinting
      }}
    >
      {children}
    </FaucetContext.Provider>
  )
}

export const useFaucet = () => useContext(FaucetContext)

export default FaucetContextProvider
