import React, { FC, useMemo, createContext, useContext } from 'react'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Token from 'src/models/Token'
import Chain from 'src/models/Chain'
import useTokens from 'src/contexts/AppContext/useTokens'
import useBridges from 'src/contexts/AppContext/useBridges'
import useTxHistory, { TxHistory } from 'src/contexts/AppContext/useTxHistory'
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
  selectedBridge: HopBridge
  setSelectedBridge: (bridge: HopBridge) => void
  networks: Chain[]
  tokens: Token[]
  events: Events
  accountDetails: AccountDetails
  txHistory: TxHistory
  txConfirm: TxConfirm
  settings: Settings
  theme: Theme
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

const AppContextProvider: FC = ({ children }) => {
  const { provider } = useWeb3Context()

  const sdk = useMemo(() => {
    return new Hop(reactAppNetwork, provider?.getSigner())
  }, [provider])

  const { bridges, selectedBridge, setSelectedBridge } = useBridges(sdk)

  const tokens = useTokens()
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
        networks,
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

export function useApp() {
  const ctx = useContext(AppContext)
  if (ctx === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}

export default AppContextProvider
