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
import ProposalStatusCard from './ProposalStatusCard'

import { VOTE_STATUS, PROPOSAL_LENGTH_IN_SECS } from 'src/config/constants'

const useStyles = makeStyles((theme) => ({
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
  }
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

  // (TODO) Timing
  const startTimestamp: number | undefined = 1607216855 // useTimestampFromBlock(proposal.startBlock)
  const endDate: DateTime | undefined = startTimestamp
    ? DateTime.fromSeconds(startTimestamp).plus({ seconds: PROPOSAL_LENGTH_IN_SECS })
    : undefined
  const now: DateTime = DateTime.local()

  // Votes
  const totalVotes: number | undefined = proposal ? proposal.forCount + proposal.againstCount : undefined
  const forPercentage: string = proposal && totalVotes ? ((proposal.forCount * 100) / totalVotes).toFixed(0) + '%' : '0%'
  const againstPercentage: string = proposal && totalVotes ? ((proposal.againstCount * 100) / totalVotes).toFixed(0) + '%' : '0%'

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
          <ProposalStatusCard
            status={proposal.status}
          />
        </div>

        <Typography variant="h4" className={styles.title}>
          { proposal.title }
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
            percentageVotes={forPercentage}
          />
          <VoteStatusCard
            voteStatus={VOTE_STATUS.AGAINST}
            numVotes={proposal.againstCount}
            percentageVotes={againstPercentage}
          />
        </Box>

        <Typography variant="h6" className={styles.contentHeader}>
          Details
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          {proposal.details?.map((d, i) => {
            return (
              <Typography variant="subtitle1" key={i}>
                {i + 1}: {d.target}.{d.functionSig}(
                {d.callData.split(',').map((content, i) => {
                  return (
                    <span key={i}>
                      {content}
                      {d.callData.split(',').length - 1 === i ? '' : ','}
                    </span>
                  )
                })}
                )
              </Typography>
            )
          })}
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
          <a
            href={`https://etherscan.io/address/${proposal.proposer}`}
            style={{ textDecoration: 'none' }}
          >
            { proposal.proposer }
          </a>
        </Typography>
      </Box>
    </Box>
  )
}

export default VotePage 
