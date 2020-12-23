import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { PROPOSAL_STATUS_COLORS } from 'src/config/constants'

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
  const { textColor, bgColor } = PROPOSAL_STATUS_COLORS[status.toUpperCase()]
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
