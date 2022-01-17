import React, { FC, useMemo, createContext, useContext } from 'react'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { useWeb3Context } from 'src/contexts/Web3Context'
import User from 'src/models/User'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import useTokens from 'src/contexts/AppContext/useTokens'
import useBridges from 'src/contexts/AppContext/useBridges'
import useTxHistory, { TxHistory } from 'src/contexts/AppContext/useTxHistory'
import useContracts, { Contracts } from 'src/contexts/AppContext/useContracts'
import useEvents, { Events } from 'src/contexts/AppContext/useEvents'
import useSettings, { Settings } from 'src/contexts/AppContext/useSettings'
import { useAccountDetails, AccountDetails } from 'src/contexts/AppContext/useAccountDetails'
import { useTxConfirm, TxConfirm } from 'src/contexts/AppContext/useTxConfirm'
import { reactAppNetwork } from 'src/config'
import { allNetworks as networks } from 'src/config/networks'
import { Theme, useTheme } from '@material-ui/core'

type AppContextProps = {
  sdk: Hop
  bridges: HopBridge[]
  selectedBridge: HopBridge | undefined
  setSelectedBridge: (bridge: HopBridge) => void
  user: User | undefined
  networks: Network[]
  contracts: Contracts | undefined
  tokens: Token[]
  events: Events | undefined
  accountDetails: AccountDetails | undefined
  txHistory?: TxHistory
  txConfirm: TxConfirm | undefined
  settings: Settings
  theme: Theme | undefined
}

const AppContext = createContext<AppContextProps>({
  user: undefined,
  networks,
  contracts: undefined,
  tokens: [],
  events: undefined,
  accountDetails: undefined,
  txHistory: undefined,
  txConfirm: undefined,
  sdk: {} as Hop,
  bridges: [],
  selectedBridge: undefined,
  setSelectedBridge: (bridge: HopBridge) => {},
  settings: {} as Settings,
  theme: undefined,
})

const AppContextProvider: FC = ({ children }) => {
  const { provider } = useWeb3Context()

  const user = useMemo(() => {
    if (!provider) {
      return undefined
    }

    return new User(provider)
  }, [provider])

  const sdk = useMemo(() => {
    return new Hop(reactAppNetwork, provider?.getSigner())
  }, [provider])

  const { bridges, selectedBridge, setSelectedBridge } = useBridges(sdk)

  const tokens = useTokens()
  const contracts = useContracts(networks, tokens)
  const events = useEvents()
  const txHistory = useTxHistory()
  const accountDetails = useAccountDetails()
  const txConfirm = useTxConfirm()
  const settings = useSettings()
  const theme = useTheme()

  return (
    <AppContext.Provider
      value={{
        sdk,
        bridges,
        selectedBridge,
        setSelectedBridge,
        user,
        networks,
        contracts,
        tokens,
        events,
        txHistory,
        accountDetails,
        txConfirm,
        settings,
        theme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

export default AppContextProvider
