import React, {
  FC,
  useMemo,
  createContext,
  useContext
} from 'react'

import { useWeb3Context } from '../Web3Context'
import User from '../../models/User'
import Token from '../../models/Token'
import Network from '../../models/Network'
import useNetworks from './useNetworks'
import useTokens from './useTokens'
import useContracts, { HopContracts } from './useContracts'

type AppContextProps = {
  user?: User,
  networks: Network[],
  contracts: HopContracts,
  tokens: Token[]
}

const AppContext = createContext<AppContextProps>({
  user: undefined,
  networks: [],
  contracts: {},
  tokens: []
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

  return (
    <AppContext.Provider value={{
      user,
      networks,
      contracts,
      tokens
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

export default AppContextProvider
