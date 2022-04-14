import React from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useApp } from 'src/contexts/AppContext'
import Modal from 'src/components/modal/Modal'
import { useWeb3Context } from 'src/contexts/Web3Context'
import ClipboardCopyButton from 'src/components/buttons/ClipboardCopyButton'
import TransactionsList from '../Transaction/TransactionsList'
import { Div } from '../ui'

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    position: 'relative',
  },
  connectedWallet: {
    border: '1px solid #fff',
    padding: '2rem',
    marginBottom: '3rem',
    borderRadius: '1rem',
  },
  changeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    borderRadius: '1.5rem',
    boxShadow: 'none',
  },
  disconnectButton: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    fontSize: '1.2rem',
    marginBottom: 0,
    borderRadius: '1.5rem',
    boxShadow: 'none',
  },
  address: {
    fontSize: '2rem',
  },
  copyButton: {
    marginLeft: '0.5rem',
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
      <Div position='relative'>
        {!!address && (
          <ManageWallet onChange={handleChangeClick} onDisconnect={handleDisconnectClick} />
        )}
      </Div>
      <Div position="relative">
        <TransactionsList />
      </Div>
    </Modal>
  )
}

export default AccountDetails
