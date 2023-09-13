import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StyledButton } from '../buttons/StyledButton'
import { Circle, Div, Icon } from '../ui'
import { useEns } from 'src/hooks'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
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
  const { accountDetails, txHistory } = useApp()
  const transactions = txHistory?.transactions
  const transactionString = JSON.stringify(txHistory?.transactions)
  const { address } = useWeb3Context()
  const styles = useStyles()
  const [numPendingTxs, setNumPendingTxs] = useState<number>(0)
  const { ensName, ensAvatar } = useEns(address?.toString())

  const handleClick = () => {
    accountDetails?.show(true)
  }

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const pendingTxs = transactions.filter(tx => tx.pending)
      setNumPendingTxs(pendingTxs.length)
    } else {
      setNumPendingTxs(0)
    }
  }, [transactionString])

  return (
    <div className={styles.root}>
      {numPendingTxs > 0 ? (
        <StyledButton flat onClick={handleClick}>
          {numPendingTxs > 3 ? "3+" : numPendingTxs} Pending <CircularProgress size={18} className={styles.spinner} />
        </StyledButton>
      ) : (
        <StyledButton
          flat
          onClick={handleClick}
          boxShadow={0}
          fontSize={[0, 0, 1]}
          px={ensAvatar ? 3 : 4}
        >
          {ensAvatar && (
            <Circle mr={2}>
              <Icon src={ensAvatar} height="100%" />
            </Circle>
          )}
          <Div>{ensName || address?.truncate()}</Div>
        </StyledButton>
      )}
    </div>
  )
}

export default TxPill
