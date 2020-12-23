import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { PROPOSAL_STATUS_COLORS, PROPOSAL_STATUS_COLORS_BG } from 'src/config/constants'

type StyleProps = {
  status: string
  statusColor: string
  statusColorBg: string
}

const useStyles = makeStyles(theme => ({
  proposalStatus: ({ statusColorBg }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1rem',
    alignSelf: 'flex-start',
    background: statusColorBg
  }),
  proposalStatusText: ({ statusColor }: StyleProps) => ({
    color: statusColor
  })
}))

type Props = {
  status: string
}

const ProposalStatusCard: FC<Props> = props => {
  const { status } = props
  const statusColor = PROPOSAL_STATUS_COLORS[status.toUpperCase()]
  const statusColorBg = PROPOSAL_STATUS_COLORS_BG[status.toUpperCase()]
  const styles = useStyles({ status, statusColor, statusColorBg })

  return (
    <Box alignItems="center" className={`${styles.proposalStatus}`}>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="div"
        className={`${styles.proposalStatusText}`}
      >
        {status}
      </Typography>
    </Box>
  )
}

export default ProposalStatusCard
