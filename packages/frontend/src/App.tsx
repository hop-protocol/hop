import React from 'react'
import 'src/App.css'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/header/Header'
import Footer from 'src/components/footer/Footer'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import { useThemeMode } from './theme/ThemeProvider'
import styled from 'styled-components'
import { Flex } from './components/ui'

const AppWrapper = styled(Flex)<any>`
  align-items: stretch;
  background-image: ${({ isDarkMode }) => (isDarkMode ? `url(${bgImageDark})` : `url(${bgImage})`)};
  background-color: ${({ theme }) => theme.colors.background.default};
  background-size: 120%;
  transition: background 0.15s ease-out;
  min-height: 100vh;
`

function App() {
  const { isDarkMode } = useThemeMode()

  return (
    <AppWrapper column isDarkMode={isDarkMode}>
      <Header />
      <AccountDetails />
      <AppRoutes />
      <TxConfirm />
      <Footer />
    </AppWrapper>
  )
}

export default App
