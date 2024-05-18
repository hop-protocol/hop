import '#App.css'
import AppRoutes from '#AppRoutes.js'
import Box from '@mui/material/Box'
import React from 'react'
import TxConfirm from '#components/txConfirm/TxConfirm.js'
import { Web3Modal } from '#components/Web3Modal/index.js'
import styled from 'styled-components'
import { AccountDetails } from '#components/AccountDetails/index.js'
import { Footer } from '#components/Footer/index.js'
import { Header } from '#components/Header/index.js'
import { useThemeMode } from '#theme/ThemeProvider.js'

const AppWrapper = styled(Box)<any>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-size: 120%;
  min-height: 100vh;
  background-image: ${({ isDarkMode }) => (isDarkMode ? `url('/assets/circles-bg-dark.svg')` : `url('/assets/circles-bg.svg')`)};
  background-color: ${({ theme }) => theme.colors?.background?.default};
`

function App() {
  const { isDarkMode } = useThemeMode()

  return (
    <AppWrapper isDarkMode={isDarkMode}>
      <Header />
      <AccountDetails />
      <AppRoutes />
      <TxConfirm />
      <Web3Modal />
      <Footer />
    </AppWrapper>
  )
}

export default App
