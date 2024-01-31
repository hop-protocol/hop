import 'src/App.css'
import AppRoutes from 'src/AppRoutes'
import Box from '@mui/material/Box'
import React from 'react'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import styled from 'styled-components'
import { AccountDetails } from 'src/components/AccountDetails'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { useThemeMode } from 'src/theme/ThemeProvider'

const AppWrapper = styled(Box)<any>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-image: ${({ isDarkMode }) => (isDarkMode ? `url(${bgImageDark})` : `url(${bgImage})`)};
  background-color: ${({ theme }) => theme.colors?.background?.default};
  background-size: 120%;
  min-height: 100vh;
`

function App() {
  const { isDarkMode } = useThemeMode()

  return (
    <AppWrapper isDarkMode={isDarkMode}>
      <Header />
      <AccountDetails />
      <AppRoutes />
      <TxConfirm />
      <Footer />
    </AppWrapper>
  )
}

export default App
