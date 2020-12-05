import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import VoteStatusCard from './VoteStatusCard'

import { VOTE_STATUS } from 'src/config/constants'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '1rem'
  },
  subTitle: {
    fontSize: '1.5rem',
    opacity: '0.5',
    marginBottom: '1rem'
  },
  componentBox: {
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem'
  },
  statusCardsContainer: {
    marginTop: '1rem',
  },
  contentHeader: {
    marginBottom: '2rem',
    fontSize: '2rem',
  },
  contentBody: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: 300
  },
}))


interface IProposal {
  id: string
  description: string
  status: string
}


type VotePageProps = {
  proposal: IProposal
}


const VotePage: FC<VotePageProps> = props => {
  const { proposal } = props
  const styles = useStyles()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        className={styles.componentBox}
        >
        <Typography variant="h4" className={styles.title}>
          { proposal.description }
        </Typography>
        <Typography variant="subtitle1" className={styles.subTitle}>
          Voting ends now
        </Typography>

        <Box display="flex" alignItems="center" className={styles.statusCardsContainer}>
          <VoteStatusCard
            voteStatus={VOTE_STATUS.FOR}
            numVotes={'123'}
          />
          <VoteStatusCard
            voteStatus={VOTE_STATUS.AGAINST}
            numVotes={'456'}
          />
        </Box>

        <Typography variant="h6" className={styles.contentHeader}>
          Details
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
        1: HOP.transfer(0x967F2c0826AF779a09E42eff7BfAdAD7618b55E5, 5047600000000000000000000)
        </Typography>

        <Typography variant="h6" className={styles.contentHeader}>
          Description
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          { proposal.description }
        </Typography>

        <Typography variant="h6" className={styles.contentHeader}>
          Proposer
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          0x7e4A8391C728fEd9069B2962699AB416628B19Fa
        </Typography>
      </Box>
    </Box>
  )
}

export default VotePage 
