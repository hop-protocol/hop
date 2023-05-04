import React from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { useApp } from 'src/contexts/AppContext'
import Modal from 'src/components/modal/Modal'
import { useWeb3Context } from 'src/contexts/Web3Context'
import ClipboardCopyButton from 'src/components/buttons/ClipboardCopyButton'
// import TransactionsList from '../Transaction/TransactionsList'
import { AccountTransferHistory } from './AccountTransferHistory'
import { Div } from '../ui'

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    position: 'relative',
  },
  connectedWallet: {
    border: '1px solid #fff',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '12px',
  },
  changeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    borderRadius: '12px',
    boxShadow: 'none',
  },
  disconnectButton: {
    position: 'absolute',
    bottom: '10px',
    right: '12px',
    fontSize: '16px',
    marginBottom: 0,
    borderRadius: '12px',
    boxShadow: 'none',
  },
  address: {
    fontSize: '18px',
  },
  copyButton: {
    marginLeft: '6px',
  },
}))

const ManageWallet = (props: any) => {
  const { onChange, onDisconnect } = props
  const styles = useStyles()
  const { address, walletName } = useWeb3Context()

  return (
    <div className={styles.connectedWallet}>
      Connected with {walletName}
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

const AccountDetails = () => {
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
      <Div position="relative">
        {/*<TransactionsList />*/}
        <AccountTransferHistory address={address?.address} />
      </Div>
    </Modal>
  )
}

export default AccountDetails
