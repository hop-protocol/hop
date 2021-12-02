import React from 'react'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { isDarkMode } from 'src/theme/theme'

function ConnectWalletButton({ mode }) {
  const { requestWallet } = useWeb3Context()

  return (
    <StyledButton highlighted onClick={requestWallet} boxShadow={isDarkMode(mode) ? 1 : 2}>
      Connect a Wallet
    </StyledButton>
  )
}

export default ConnectWalletButton
