import React from 'react'
import { StyledButton } from '#components/Button/StyledButton.js'
import { useThemeMode } from '#theme/ThemeProvider.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { wait } from '#utils/index.js'

export function ConnectWalletButton(props: any) {
  const { fullWidth, large } = props

  const { requestWallet } = useWeb3Context()
  const { isDarkMode } = useThemeMode()

  async function handleRequestWallet() {
    requestWallet()

    if (!isDarkMode) {
      await wait(10)

      // setLightModeStyles()
    }
  }

  return (
    <StyledButton
      highlighted
      onClick={handleRequestWallet}
      boxShadow={isDarkMode ? 'top' : 'bottom'}
      fontSize={[0, 0, 1, 2]}
      minWidth="12rem"
      fullWidth={fullWidth}
      large={large}
    >
      Connect a Wallet
    </StyledButton>
  )
}
