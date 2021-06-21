import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TxStatus from 'src/components/txStatus'
import Transaction from 'src/models/Transaction'
import Modal from 'src/components/modal'

const useStyles = makeStyles(theme => ({
  txStatusInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txStatusCloseButton: {
    marginTop: '1rem'
  },
}))

type Props = {
  tx?: Transaction | null
  onClose?: () => void
}

function TxStatusModal (props: Props) {
  const styles = useStyles()
  const { onClose, tx } = props
  const handleTxStatusClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    tx ? (
      <Modal onClose={handleTxStatusClose}>
        <TxStatus tx={tx} />
        <Box
          display="flex"
          alignItems="center"
          className={styles.txStatusInfo}
        >
          <Typography variant="body1">
            <em>This may take a few minutes</em>
          </Typography>
          <MuiButton
            className={styles.txStatusCloseButton}
            onClick={handleTxStatusClose}
          >
            Close
          </MuiButton>
        </Box>
      </Modal>
    ) : null
  )
}

export default TxStatusModal
