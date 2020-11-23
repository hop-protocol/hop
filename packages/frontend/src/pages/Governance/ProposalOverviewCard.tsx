import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { PROPOSAL_STATUSES } from '../../config/constants'

import Button from '../../components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles(() => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box',
    marginTop: '1.5rem',
    // display: 'grid',
    alignItems: 'left',
    textAlign: 'left',
    cursor: 'pointer',
  },
  proposalDescription: {
    textAlign: 'left'
  },
  proposalStatus: {
    fontSize: '0.825rem',
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid',
    width: '5rem',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    textAlign: 'center',
  }
}))

type Props = {
  proposalIndex: string
  proposalName: string
  proposalStatus: PROPOSAL_STATUSES
}

const ProposalOverviewCard: FC<Props> = (props) => {

  const {
    proposalIndex,
    proposalName,
    proposalStatus
  } = props
  const styles = useStyles()

  return (
    <Card className={styles.root}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">
                { proposalIndex }
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
                { proposalName }
            </Typography>
            {/* TODO: Add color to style, not directly here */}
            <Box className={styles.proposalStatus} color={proposalStatus === 'succeeded' ? 'green' : 'red' }>
                { proposalStatus }
            </Box>
        </Box>
    </Card>
  )
}

export default ProposalOverviewCard 