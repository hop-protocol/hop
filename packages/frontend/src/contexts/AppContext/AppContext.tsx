import Network from 'src/models/Network'
import React, { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import Token from 'src/models/Token'
import useBridges from 'src/contexts/AppContext/useBridges'
import useEvents, { Events } from 'src/contexts/AppContext/useEvents'
import useSettings, { Settings } from 'src/contexts/AppContext/useSettings'
import useTokens from 'src/contexts/AppContext/useTokens'
import useTxHistory, { TxHistory } from 'src/contexts/AppContext/useTxHistory'
import { AccountDetails, useAccountDetails } from 'src/contexts/AppContext/useAccountDetails'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { Theme, useTheme } from '@material-ui/core/styles'
import { TxConfirm, useTxConfirm } from 'src/contexts/AppContext/useTxConfirm'
import { blocklist, reactAppNetwork, rpcProviderOverrides } from 'src/config'
import { allNetworks as networks } from 'src/config/networks'
import { useWeb3Context } from 'src/contexts/Web3Context'

type AppContextProps = {
  sdk: Hop
  bridges: HopBridge[]
  selectedBridge: HopBridge
  setSelectedBridge: (bridge: HopBridge) => void
  networks: Network[]
  tokens: Token[]
  events: Events
  accountDetails: AccountDetails
  txHistory: TxHistory
  txConfirm: TxConfirm
  settings: Settings
  theme: Theme
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { provider } = useWeb3Context()

  const sdk = useMemo(() => {
    const hop = new Hop({
      network: reactAppNetwork,
      signer: provider?.getSigner(),
      blocklist,
      chainProviders: {
        ...rpcProviderOverrides,
      }
    })
    return hop
  }, [provider])

  const { bridges, selectedBridge, setSelectedBridge } = useBridges(sdk)

  const tokens = useTokens()
  const events = useEvents()
  const txHistory = useTxHistory(sdk)
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
