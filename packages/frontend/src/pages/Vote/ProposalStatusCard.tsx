import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { VOTE_STATUS } from 'src/config/constants'

type StyleProps = {
  status : string
}

const useStyles = makeStyles(theme => ({
  proposalStatus: ({ status }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1rem',
    alignSelf: 'flex-start',
    background: status === 'passed'
    ?
      'rgb(218 229 221)'
    :
      'rgb(228, 214, 214)'
  }),
  proposalStatusText: ({ status }: StyleProps) => ({
    color: status === 'passed'
    ?
      '#00A72F'
    :
      '#C50602'
  })
}))

type Props = {
  status: string
}

const ProposalStatusCard: FC<Props> = props => {
  const { status } = props
  const styles = useStyles({ status })

  return (
    <Box alignItems="center" className={`${styles.proposalStatus}`}>
      <Typography
          variant="subtitle2"
          color="textSecondary"
          component="div"
          className={`${styles.proposalStatusText}`}
      >
        { status }
      </Typography>
    </Box>
  )
}

export default ProposalStatusCard 
