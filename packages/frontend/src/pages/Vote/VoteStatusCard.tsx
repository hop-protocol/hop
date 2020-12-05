import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { VOTE_STATUS } from 'src/config/constants'

type StyleProps = {
  voteStatus: string
}

const statusColors = {
  green: 'rgba(75, 181, 67)',
  red: 'rgba(252, 16, 13)'
}

const useStyles = makeStyles(theme => ({
  previewsBox: {
    width: '51.6rem',
    marginBottom: '2rem',
    cursor: 'pointer'
  },
  previewBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  previewCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  proposalStatus: ({ voteStatus }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1.5rem',
    boxShadow: voteStatus === VOTE_STATUS.FOR
    ?
    `
      inset -3px -3px 6px ${statusColors.green},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
    :
    `
      inset -3px -3px 6px ${statusColors.red},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
  })
}))

type Props = {
  voteStatus: string
  numVotes: string
}

const VoteStatusCard: FC<Props> = props => {
  const { voteStatus, numVotes } = props
  const styles = useStyles({ voteStatus })

  return (
    <Box
      alignItems="center"
      className={styles.previewsBox}
    >
      <Card className={styles.previewCard}>
        <Typography
            variant="subtitle2"
            color="textSecondary"
            component="div"
        >
            { voteStatus }
        </Typography>
        <Typography
            variant="subtitle2"
            color="textSecondary"
            component="div"
        >
          { numVotes }
        </Typography>
      </Card>
    </Box>
  )
}

export default VoteStatusCard 
