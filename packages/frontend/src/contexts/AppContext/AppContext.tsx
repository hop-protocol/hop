import React, { FC, useMemo, createContext, useContext } from 'react'

import { useWeb3Context } from 'src/contexts/Web3Context'
import User from 'src/models/User'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import useNetworks from './useNetworks'
import useTokens from './useTokens'
import useTxHistory, { TxHistory } from './useTxHistory'
import useContracts, { Contracts } from './useContracts'
import useEvents, { Events } from './useEvents'
import { useAccountDetails, AccountDetails } from './useAccountDetails'
import { useTxConfirm, TxConfirm } from './useTxConfirm'
import logger from 'src/logger'

type AppContextProps = {
  user: User | undefined
  networks: Network[]
  contracts: Contracts | undefined
  tokens: Token[]
  events: Events | undefined
  accountDetails: AccountDetails | undefined
  txHistory: TxHistory | undefined
  txConfirm: TxConfirm | undefined
}

const AppContext = createContext<AppContextProps>({
  user: undefined,
  networks: [],
  contracts: undefined,
  tokens: [],
  events: undefined,
  accountDetails: undefined,
  txHistory: undefined,
  txConfirm: undefined
})

const AppContextProvider: FC = ({ children }) => {
  //logger.debug('AppContextProvider render')
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
  const events = useEvents()
  const txHistory = useTxHistory()
  const accountDetails = useAccountDetails()
  const txConfirm = useTxConfirm()

  return (
    <AppContext.Provider
      value={{
        user,
        networks,
        contracts,
        tokens,
        events,
        txHistory,
        accountDetails,
        txConfirm
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

export default AppContextProvider
