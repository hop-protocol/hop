import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { DateTime, LocaleOptions } from 'luxon'
import { BigNumber } from 'ethers'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { VoteContextProvider, useVoteContext } from 'src/pages/Vote/VoteContext'
import useTimestampFromBlock from 'src/hooks/useTimestampFromBlock'

import { IProposal } from 'src/config'

import { getEtherscanLink } from '../../utils'

import Address from '../../models/Address'
import VoteStatusCard from './VoteStatusCard'
import ProposalStatusCard from './ProposalStatusCard'

import {
  PROPOSAL_STATUSES,
  VOTE_STATUS,
  PROPOSAL_LENGTH_IN_SECS,
  COMMON_CONTRACT_NAMES
} from 'src/constants'

const useStyles = makeStyles(theme => ({
  componentBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem',
    padding: '1.8rem',
    borderRadius: '1.5rem',
    boxShadow: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)
    `
  },
  navStatusBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1rem'
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
    opacity: '0.5'
  },
  statusAndVoteCardsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem'
  },
  statusAndVoteContainer: {
    width: '23.8rem',
    padding: '1rem',
    borderRadius: '1.5rem',
    marginBottom: '1rem',
    cursor: 'pointer'
  },
  voteContainer: {
    width: '23.8rem',
    padding: '1rem',
    borderRadius: '1.5rem',
    boxShadow: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)
    `
  },
  voteDelegationContainer: {
    padding: '1rem',
    borderRadius: '1.5rem',
    boxShadow: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)
    `
  },
  contentHeader: {
    marginBottom: '2rem',
    fontSize: '2rem'
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

const VotePageChild: FC<VotePageProps> = props => {
  const { proposal } = props
  const styles = useStyles({ status: proposal.status })
  const history = useHistory()
  const { balance } = useVoteContext()
  const { connectedNetworkId } = useWeb3Context()
  const { contracts } = useApp()
  const governorAlpha = contracts?.governance.governorAlpha

  const handleArrowClick = () => {
    history.push('/vote')
  }

  const handleVoteForClick = () => {
    const forVote: string = '1'
    governorAlpha?.castVote(proposal.id, forVote)
  }

  const handleVoteAgainstClick = () => {
    const forAgainst: string = '0'
    governorAlpha?.castVote(proposal.id, forAgainst)
  }

  // Timing
  const startTimestamp: number | undefined = useTimestampFromBlock(
    proposal.startBlock
  )
  const endDate: DateTime | undefined = startTimestamp
    ? DateTime.fromSeconds(startTimestamp).plus({
      seconds: PROPOSAL_LENGTH_IN_SECS
    })
    : undefined
  const now: DateTime = DateTime.local()

  // Votes
  const totalVotes: number | undefined = proposal
    ? proposal.forCount + proposal.againstCount
    : undefined
  const forPercentage: string =
    proposal && totalVotes
      ? ((proposal.forCount * 100) / totalVotes).toFixed(0) + '%'
      : '0%'
  const againstPercentage: string =
    proposal && totalVotes
      ? ((proposal.againstCount * 100) / totalVotes).toFixed(0) + '%'
      : '0%'

  // Only show voting if user has > 0 votes at proposal start block and proposal is active
  const availableVotes = BigNumber.from(Number(balance))
  const showVotingButtons =
    availableVotes &&
    availableVotes.gte(BigNumber.from(0)) &&
    proposal &&
    proposal.status === PROPOSAL_STATUSES.ACTIVE

  // Show links in proposal details if content is an address
  // If content is contract with common name, replace address with common name
  const linkIfAddress = (content: string) => {
    try {
      const address = new Address(content)
      const commonName =
        COMMON_CONTRACT_NAMES[address.toString()] ?? address.toString()
      return (
        <Link
          href={getEtherscanLink(
            connectedNetworkId,
            address.toString(),
            'address'
          )}
        >
          {commonName}
        </Link>
      )
    } catch {
      return <span>{content}</span>
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box className={styles.componentBox}>
        <Box className={styles.navStatusBarContainer}>
          <Button
            className={styles.allProposalsContainer}
            onClick={async event => {
              event.preventDefault()
              handleArrowClick()
            }}
          >
            <ArrowLeft size={20} /> All Proposals
          </Button>
          <ProposalStatusCard status={proposal.status} />
        </Box>

        <Typography variant="h4" className={styles.title}>
          {proposal.title}
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          {endDate && endDate < now
            ? 'Voting ended ' +
              (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL as LocaleOptions))
            : proposal
              ? 'Voting ends approximately ' +
              (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL as LocaleOptions))
              : ''}
        </Typography>

        <Box className={styles.statusAndVoteCardsContainer}>
          <Box className={styles.statusAndVoteContainer}>
            <Button
              className={styles.voteContainer}
              onClick={handleVoteForClick}
            >
              Vote For
            </Button>
            <VoteStatusCard
              voteStatus={VOTE_STATUS.FOR}
              numVotes={proposal.forCount}
              percentageVotes={forPercentage}
            />
          </Box>
          <Box className={styles.statusAndVoteContainer}>
            <Button
              className={styles.voteContainer}
              onClick={handleVoteAgainstClick}
            >
              Vote Against
            </Button>
            <VoteStatusCard
              voteStatus={VOTE_STATUS.AGAINST}
              numVotes={proposal.againstCount}
              percentageVotes={againstPercentage}
            />
          </Box>
        </Box>

        {proposal &&
          proposal.status === PROPOSAL_STATUSES.ACTIVE &&
          !showVotingButtons && (
            <Box className={styles.voteDelegationContainer}>
              <Typography variant="subtitle1" className={styles.subtitle}>
                Only HOP votes that were self delegated or delegated to another
                address before block {proposal.startBlock} are eligible for
                voting.{' '}
              </Typography>
            </Box>
        )}

        <Typography variant="h6" className={styles.contentHeader}>
          Details
        </Typography>
        {proposal.details?.map((d, i) => {
          return (
            <Typography
              variant="subtitle1"
              className={styles.contentBody}
              key={i}
            >
              {i + 1}: {linkIfAddress(d.target)}.{d.functionSig}(
              {d.callData.split(',').map((content, i) => {
                return (
                  <span key={i}>
                    {linkIfAddress(content)}
                    {d.callData.split(',').length - 1 === i ? '' : ','}
                  </span>
                )
              })}
              )
            </Typography>
          )
        })}

        <Typography variant="h6" className={styles.contentHeader}>
          Description
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          {proposal.description}
        </Typography>

        <Typography variant="h6" className={styles.contentHeader}>
          Proposer
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          <Link
            href={`https://etherscan.io/address/${proposal.proposer}`}
            underline={'none'}
          >
            {proposal.proposer}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

const VotePage: FC<VotePageProps> = props => {
  const { proposal } = props
  return (
    <VoteContextProvider>
      <VotePageChild proposal={proposal} />
    </VoteContextProvider>
  )
}

export default VotePage
