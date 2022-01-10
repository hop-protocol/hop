import React from 'react'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { wait } from 'src/utils'

function setWalletButtonStyles() {
  const walletButtons = document.querySelectorAll('.bn-onboard-custom.bn-onboard-icon-button')
  walletButtons.forEach(el => {
    ;(el as any).style.backgroundColor = '#FFFFFF'
    ;(el as any).style.color = '#0F0524'
  })
}

function setLightModeStyles() {
  const modalContent = document.querySelector('.bn-onboard-custom.bn-onboard-modal-content')
  const moreButton = document.querySelector(
    '.bn-onboard-custom.bn-onboard-prepare-button.cta.bn-onboard-prepare-button-center'
  )
  const whatsAWallet = document.querySelector(
    '.bn-onboard-custom.bn-onboard-select-info-container span'
  )

  ;(modalContent as any).style.color = '#4a4a4a'
  ;(modalContent as any).style.backgroundColor = '#FDF7F9'
  ;(whatsAWallet as any).style.color = '#4a4a4a'

  setWalletButtonStyles()

  moreButton?.addEventListener('click', setWalletButtonStyles)
}

function ConnectWalletButton({ mode }) {
  const { requestWallet } = useWeb3Context()
  const { isDarkMode } = useThemeMode()

  async function handleRequestWallet() {
    requestWallet()

    if (!isDarkMode) {
      await wait(10)

      setLightModeStyles()
    }
  }

  return (
    <StyledButton
      highlighted
      onClick={handleRequestWallet}
      boxShadow={isDarkMode ? 'top' : 'bottom'}
      fontSize={[0, 0, 1, 2]}
      minWidth="12rem"
    >
      Connect a Wallet
    </StyledButton>
  )
}

export default ConnectWalletButton
