import React, { FC, useEffect, useState } from 'react'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import Alert from 'src/components/alert/Alert'
import { Link } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/header/HeaderRoutes'
import TxPill from 'src/components/header/TxPill'
import HopLogoFullColor from 'src/assets/logos/hop-logo-full-color.svg'
import { isMainnet } from 'src/config'
import Settings from 'src/pages/Send/Settings'

const useStyles = makeStyles((theme: Theme) => ({
  root: {

  },
}))

const WalletWarning: FC = () => {
  const styles = useStyles()
  const [warning, setWarning] = useState('')
  const { provider, address, walletName } = useWeb3Context()

  useEffect(() => {
    const update = async () => {
      if (
        !(address && provider && walletName)
      ) {
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
        return 'Only send funds on networks supported by your wallet provider if it is a smart contract wallet or there may permanent be loss of funds.'
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
      {!!warning &&
        <Box
          display="flex"
          flexDirection="row"
          flex={1}
          justifyContent="center"
        >
          <Alert severity="warning" onClose={() => closeWarning()} text={warning} />
        </Box>
      }
    </Box>
  )
}

export default WalletWarning
