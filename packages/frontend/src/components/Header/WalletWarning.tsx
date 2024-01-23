import React, { FC, useEffect, useState } from 'react'
import { Alert } from 'src/components/Alert'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useWeb3Context } from 'src/contexts/Web3Context'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

export const WalletWarning: FC = () => {
  const styles = useStyles()
  const [warning, setWarning] = useState('')
  const { provider, address, walletName } = useWeb3Context()

  useEffect(() => {
    const update = async () => {
      if (!(address && provider && walletName)) {
        return ''
      }

      const _address = address.address
      try {
        const cached = sessionStorage.getItem('walletWarningClosed')
        if (cached && cached === _address) {
          return ''
        }
      } catch (err: any) {
        console.error(err)
      }

      if (walletName === 'WalletConnect') {
        return 'Only send funds on networks supported by your wallet provider if it is a smart contract wallet or there may be permanent loss of funds.'
      }

      return ''
    }

    update()
      .then(_warning => {
        setWarning(_warning)
      })
      .catch(err => console.error(err))
  }, [address, provider, walletName])

  const closeWarning = () => {
    setWarning('')
    try {
      if (address) {
        sessionStorage.setItem('walletWarningClosed', address.address)
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <Box className={styles.root} display="flex" alignItems="center">
      {!!warning && (
        <Box display="flex" flexDirection="row" flex={1} justifyContent="center">
          <Alert severity="warning" onClose={() => closeWarning()} text={warning} />
        </Box>
      )}
    </Box>
  )
}
