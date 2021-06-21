import React, { FC } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { PROPOSAL_STATUSES } from 'src/constants'

type StyleProps = {
  textColor: string
  bgColor: string
}

const useStyles = makeStyles(theme => ({
  proposalStatus: ({ bgColor }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1rem',
    alignSelf: 'flex-start',
    background: bgColor
  }),
  proposalStatusText: ({ textColor }: StyleProps) => ({
    color: textColor
  })
}))

type Props = {
  status: string
}

const ProposalStatusCard: FC<Props> = props => {
  const { status } = props
  const theme = useTheme()

  let textColor: string
  let bgColor: string

  switch (status) {
    case PROPOSAL_STATUSES.PENDING: {
      ;(textColor = theme.palette.secondary.main)
      ;(bgColor = theme.palette.secondary.light)
      break
    }
    case PROPOSAL_STATUSES.ACTIVE: {
      ;(textColor = theme.palette.info.main)
      ;(bgColor = theme.palette.info.light)
      break
    }
    case PROPOSAL_STATUSES.CANCELLED: {
      ;(textColor = theme.palette.secondary.main)
      ;(bgColor = theme.palette.secondary.light)
      break
    }
    case PROPOSAL_STATUSES.DEFEATED: {
      ;(textColor = theme.palette.error.main)
      ;(bgColor = theme.palette.error.light)
      break
    }
    case PROPOSAL_STATUSES.SUCCEEDED: {
      ;(textColor = theme.palette.success.main)
      ;(bgColor = theme.palette.success.light)
      break
    }
    case PROPOSAL_STATUSES.QUEUED: {
      ;(textColor = theme.palette.secondary.main)
      ;(bgColor = theme.palette.secondary.light)
      break
    }
    case PROPOSAL_STATUSES.EXPIRED: {
      ;(textColor = theme.palette.secondary.main)
      ;(bgColor = theme.palette.secondary.light)
      break
    }
    case PROPOSAL_STATUSES.EXECUTED: {
      ;(textColor = theme.palette.success.main)
      ;(bgColor = theme.palette.success.light)
      break
    }
    default: {
      ;(textColor = theme.palette.secondary.main)
      ;(bgColor = theme.palette.secondary.light)
    }
  }

  const styles = useStyles({ textColor, bgColor })

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
