import Network from '#models/Network.js'
import React, { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import Token from '#models/Token.js'
import useBridges from '#contexts/AppContext/useBridges.js'
import useEvents, { Events } from '#contexts/AppContext/useEvents.js'
import useSettings, { Settings } from '#contexts/AppContext/useSettings.js'
import useTokens from '#contexts/AppContext/useTokens.js'
import useTxHistory, { TxHistory } from '#contexts/AppContext/useTxHistory.js'
import { AccountDetails, useAccountDetails } from '#contexts/AppContext/useAccountDetails.js'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { TxConfirm, useTxConfirm } from '#contexts/AppContext/useTxConfirm.js'
import { blocklist, reactAppNetwork, rpcProviderOverrides } from '#config/index.js'
import { allNetworks as networks } from '#config/networks.js'
import { useTheme } from '@mui/styles'
import { useWeb3Context } from '#contexts/Web3Context.js'

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
  theme: any
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
