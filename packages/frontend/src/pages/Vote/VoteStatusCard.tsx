import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import { VOTE_STATUS } from 'src/constants'

type StyleProps = {
  status: string
  percentageVotes: string
}

const statusColors = {
  green: 'rgba(75, 181, 67)',
  red: 'rgba(252, 16, 13)'
}

const useStyles = makeStyles(theme => ({
  previewBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  previewCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardBottom: {},
  proposalStatus: ({ status }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1.5rem',
    boxShadow:
      status === VOTE_STATUS.FOR
        ? `
      inset -3px -3px 6px ${statusColors.green},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
        : `
      inset -3px -3px 6px ${statusColors.red},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
  }),
  progressWrapper: {
    width: '100%',
    marginTop: '1rem',
    height: '4px',
    borderRadius: '4px',
    position: 'relative',
    backgroundColor: '#abb1ae'
  },
  progress: ({ status, percentageVotes }: any) => ({
    height: '4px',
    borderRadius: '4px',
    width: `${percentageVotes}`,
    backgroundColor:
      status === VOTE_STATUS.FOR
        ? `${statusColors.green}`
        : `${statusColors.red}`
  })
}))

type Props = {
  voteStatus: string
  numVotes: number
  percentageVotes: string
}

const VoteStatusCard: FC<Props> = props => {
  const { voteStatus, numVotes, percentageVotes } = props
  const styles = useStyles({ status: voteStatus, percentageVotes })

  return (
    <Card className={styles.previewCard}>
      <div className={styles.cardTop}>
        <Typography variant="subtitle2" color="textSecondary" component="div">
          {voteStatus}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" component="div">
          {numVotes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Typography>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.progressWrapper}>
          <div className={styles.progress} />
        </div>
      </div>
    </Card>
  )
}

export default VoteStatusCard
