import React, { FC } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { PROPOSAL_STATUSES } from 'src/config/constants'

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
      textColor = theme.palette.info.dark,
      bgColor = theme.palette.primary.light
      break
    }
    case PROPOSAL_STATUSES.ACTIVE: {
      textColor = theme.palette.info.dark,
      bgColor = theme.palette.primary.light
      break
    }
    case PROPOSAL_STATUSES.CANCELLED: {
      textColor = theme.palette.text.primary,
      bgColor = theme.palette.text.secondary
      break
    }
    case PROPOSAL_STATUSES.DEFEATED: {
      textColor = theme.palette.error.dark,
      bgColor = theme.palette.secondary.light
      break
    }
    case PROPOSAL_STATUSES.SUCCEEDED: {
      textColor = theme.palette.success.dark,
      bgColor = theme.palette.success.light
      break
    }
    case PROPOSAL_STATUSES.QUEUED: {
      textColor = theme.palette.text.primary,
      bgColor = theme.palette.text.secondary
      break
    }
    case PROPOSAL_STATUSES.EXPIRED: {
      textColor = theme.palette.text.primary,
      bgColor = theme.palette.text.secondary
      break
    }
    case PROPOSAL_STATUSES.EXECUTED: {
      textColor = theme.palette.success.dark,
      bgColor = theme.palette.success.light
      break
    }
    default: {
      textColor = theme.palette.text.primary,
      bgColor = theme.palette.text.secondary
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
