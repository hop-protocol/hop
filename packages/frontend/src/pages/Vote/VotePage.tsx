import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { ArrowLeft } from 'react-feather'
import { DateTime } from 'luxon'

import { IProposal } from 'src/config'

import VoteStatusCard from './VoteStatusCard'

import { VOTE_STATUS, PROPOSAL_LENGTH_IN_SECS } from 'src/config/constants'

type StyleProps = {
  status: string
}

const statusColors = {
  green: 'rgba(75, 181, 67)',
  red: 'rgba(252, 16, 13)'
}

const useStyles = makeStyles(() => ({
  navStatusBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  allProposalsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    marginBottom: '1rem'
  },
  subtitle: {
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
  proposalStatus: ({ status }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1.5rem',
    boxShadow: status === 'passed'
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


type VotePageProps = {
  proposal: IProposal
}


const VotePage: FC<VotePageProps> = props => {
  const { proposal } = props
  const styles = useStyles({ status: proposal.status })
  const history = useHistory()

  const handleArrowClick = () => {
    history.push(`/vote`)
  }

  const totalVote: number = Number(proposal.forCount) + Number(proposal.againstCount)
  const voteForPercentage: number = Number(proposal.forCount) / totalVote
  const voteAgainstPercentage: number = Number(proposal.againstCount) / totalVote

  // TODO 
  const startTimestamp: number | undefined = 1607216855 // useTimestampFromBlock(proposal.startBlock)
  const endDate: DateTime | undefined = startTimestamp
    ? DateTime.fromSeconds(startTimestamp).plus({ seconds: PROPOSAL_LENGTH_IN_SECS })
    : undefined
  const now: DateTime = DateTime.local()


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        className={styles.componentBox}
        >
        
        <div className={styles.navStatusBarContainer}>
          <Button
            className={styles.allProposalsContainer}
            onClick={async (event) => {
              event.preventDefault()
              handleArrowClick()
            }}
          >
            <ArrowLeft size={20} /> All Proposals
          </Button>
          <Box alignItems="center" className={`${styles.proposalStatus}`}>
            <Typography
                variant="subtitle2"
                color="textSecondary"
                component="div"
            >
              { proposal.status }
            </Typography>
          </Box>
        </div>

        <Typography variant="h4" className={styles.title}>
          { proposal.description }
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          {/* TODO */}
          {endDate && endDate < now
            ? 'Voting ended ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
            : proposal
            ? 'Voting ends approximately ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
            : ''}
        </Typography>

        <Box display="flex" alignItems="center" className={styles.statusCardsContainer}>
          <VoteStatusCard
            voteStatus={VOTE_STATUS.FOR}
            numVotes={proposal.forCount}
            percentageVotes={voteForPercentage.toString()}
          />
          <VoteStatusCard
            voteStatus={VOTE_STATUS.AGAINST}
            numVotes={proposal.againstCount}
            percentageVotes={voteAgainstPercentage.toString()}
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
