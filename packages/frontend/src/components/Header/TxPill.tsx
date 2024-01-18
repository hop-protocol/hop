import CircularProgress from '@material-ui/core/CircularProgress'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useApp } from 'src/contexts/AppContext'
import { StyledButton } from 'src/components/Button/StyledButton'
import { Circle } from 'src/components/ui/Circle'
import { Icon } from 'src/components/ui/Icon'
import { useEns } from 'src/hooks'
import { useWeb3Context } from 'src/contexts/Web3Context'

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

export const TxPill = () => {
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
      const pendingTxs = transactions.filter(tx => tx.pendingDestinationConfirmation)
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
          <Box>{ensName ?? address?.truncate()}</Box>
        </StyledButton>
      )}
    </div>
  )
}
