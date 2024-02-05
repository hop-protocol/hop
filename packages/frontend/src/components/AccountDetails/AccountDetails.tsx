import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import Typography from '@mui/material/Typography'
import { AccountTransferHistory } from 'src/components/AccountDetails/AccountTransferHistory'
import { ClipboardCopyButton } from 'src/components/Button/ClipboardCopyButton'
import { Modal } from 'src/components/Modal'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    position: 'relative',
  },
  connectedWallet: {
    border: '1px solid #fff !important',
    padding: '2rem !important',
    marginBottom: '3rem !important',
    borderRadius: '1rem !important',
  },
  changeButton: {
    position: 'absolute !important',
    top: '1rem !important',
    right: '1rem !important',
    borderRadius: '1.5rem !important',
    boxShadow: 'none !important',
    padding: '0 !important',
    width: 'auto !important',
    minWidth: '0 !important'
  } as any,
  disconnectButton: {
    position: 'absolute !important',
    bottom: '1rem !important',
    right: '1rem !important',
    fontSize: '1.2rem !important',
    marginBottom: '0 !important',
    borderRadius: '1.5rem !important',
    boxShadow: 'none !important',
    padding: '0 !important',
    width: 'auto !important',
    minWidth: '0 !important'
  } as any,
  address: {
    fontSize: '2rem !important',
  },
  copyButton: {
    marginLeft: '0.5rem !important',
  },
}))

const ManageWallet = (props: any) => {
  const { onChange, onDisconnect } = props
  const styles = useStyles()
  const { address, walletName, walletIcon } = useWeb3Context()

  return (
    <div className={styles.connectedWallet}>
      <Box display="flex" alignItems="center">
        <Typography>
          Connected with&nbsp;
        </Typography>
        {!!walletIcon && (
          <Box width="28px" height="28px" display="flex">
            <img src={walletIcon} alt="" width="100%" />
          </Box>
        )}
        <Typography>
          {walletName}
        </Typography>
      </Box>
      <Button className={styles.changeButton} onClick={onChange}>
        Change
      </Button>
      <Button className={styles.disconnectButton} onClick={onDisconnect}>
        Disconnect
      </Button>
      <div className={styles.address}>
        <span>{address?.truncate()}</span>
        <div>
          <ClipboardCopyButton
            className={styles.copyButton}
            value={address?.toString()}
            label={'Copy address'}
          />
        </div>
      </div>
    </div>
  )
}

export const AccountDetails = () => {
  const styles = useStyles()
  const { accountDetails } = useApp()
  const { address, requestWallet, disconnectWallet } = useWeb3Context()

  if (!accountDetails?.open) {
    return null
  }

  const handleClose = () => {
    accountDetails.show(false)
  }

  const handleChangeClick = () => {
    handleClose()
    requestWallet()
  }

  const handleDisconnectClick = () => {
    handleClose()
    disconnectWallet()
  }

  return (
    <Modal onClose={handleClose}>
      <Box className={styles.box}>
        {!!address && (
          <ManageWallet onChange={handleChangeClick} onDisconnect={handleDisconnectClick} />
        )}
      </Box>
      <Box position="relative">
        <AccountTransferHistory address={address?.address} />
      </Box>
    </Modal>
  )
}
