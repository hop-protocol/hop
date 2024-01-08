import 'src/App.css'
import AppRoutes from 'src/AppRoutes'
import React from 'react'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import styled from 'styled-components'
import { AccountDetails } from 'src/components/AccountDetails'
import { Flex } from 'src/components/ui'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { useThemeMode } from 'src/theme/ThemeProvider'

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
