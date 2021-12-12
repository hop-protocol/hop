import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StyledButton } from '../buttons/StyledButton'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  pendingButton: {
    backgroundColor: 'rgba(179, 46, 255, 0.12)',
  },
  spinner: {
    marginLeft: '1rem',
  },
}))

const TxPill = () => {
  const app = useApp()
  const { accountDetails } = app
  const { address, provider } = useWeb3Context()
  const transactions = app?.txHistory?.transactions
  const styles = useStyles()
  const [numPendingTxs, setNumPendingTxs] = useState(0)
  const [ensName, setENSName] = useState<string | null>(null);

  const handleClick = () => {
    accountDetails?.show(true)
  }

  useEffect(() => {
    if (transactions && transactions?.length > 0) {
      const pts = transactions.filter(tx => tx.pending)
      setNumPendingTxs(pts.length)
    } else {
      setNumPendingTxs(0)
    }
  }, [transactions])

  useEffect(() => {
    if (address) {
      provider?.lookupAddress(address.toString()).then(setENSName);
    }
  })

  return (
    <div className={styles.root}>
      {numPendingTxs > 0 ? (
        <StyledButton flat onClick={handleClick}>
          {numPendingTxs} Pending <CircularProgress size={18} className={styles.spinner} />
        </StyledButton>
      ) : (
        <StyledButton flat onClick={handleClick} boxShadow={0} fontSize={[0, 0, 1]}>
          {ensName || address?.truncate()}
        </StyledButton>
      )}
    </div>
  )
}

export default TxPill
