import React, { FC, useMemo, createContext, useContext } from 'react'

import { useWeb3Context } from 'src/contexts/Web3Context'
import User from 'src/models/User'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import useNetworks from './useNetworks'
import useTokens from './useTokens'
import useTransactions from './useTransactions'
import useContracts, { HopContracts } from './useContracts'
import { useAccountDetails, AccountDetails } from './useAccountDetails'

type AppContextProps = {
  user?: User
  networks: Network[]
  contracts: Partial<HopContracts>
  tokens: Token[]
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  accountDetails: AccountDetails | undefined
}

const AppContext = createContext<AppContextProps>({
  user: undefined,
  networks: [],
  contracts: {},
  tokens: [],
  transactions: [],
  setTransactions: (transactions: Transaction[]) => {},
  accountDetails: undefined
})

const AppContextProvider: FC = ({ children }) => {
  const { provider } = useWeb3Context()

  const user = useMemo(() => {
    if (!provider) {
      return undefined
    }

    return new User(provider)
  }, [provider])

  const networks = useNetworks()
  const contracts = useContracts(networks)
  const tokens = useTokens(networks)
  const { transactions, setTransactions } = useTransactions()
  const accountDetails = useAccountDetails()

  return (
    <AppContext.Provider
      value={{
        user,
        networks,
        contracts,
        tokens,
        transactions,
        setTransactions,
        accountDetails
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

export default AppContextProvider
