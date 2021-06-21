import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { IProposal } from 'src/config'
import { useApp } from 'src/contexts/AppContext'
import ProposalPreviewCard from 'src/pages/Vote/ProposalPreviewCard'
import DelegateModal from 'src/pages/Vote/DelegateModal/DelegateModal'
import { ZERO_ADDRESS } from 'src/constants'
import { VoteContextProvider, useVoteContext } from 'src/pages/Vote/VoteContext'

const useStyles = makeStyles(() => ({
  headerWrapper: {
    display: 'flex',
    width: '51rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4.2rem'
  },
  buttonStyle: {
    margin: 'initial'
  },
  editDelegateButtonStyle: {
    marginTop: '1rem'
  },
  pricesBox: {
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem'
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  pricesCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  delegateOverview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

type VoteProps = {
  proposals: IProposal[]
}

const VoteChild: FC<VoteProps> = props => {
  const { proposals } = props
  const styles = useStyles()
  const { contracts } = useApp()
  const { balance, delegate, humanReadableDelegate } = useVoteContext()
  const l1Hop = contracts?.governance.l1Hop

  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <DelegateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        numVotes={balance}
        l1Hop={l1Hop}
      />
      <Box display="flex" alignItems="center" className={styles.headerWrapper}>
        <Typography variant="h6">Participating Pools</Typography>
        {balance !== '0.00' && delegate === ZERO_ADDRESS ? (
          <Button
            flat
            className={styles.buttonStyle}
            onClick={() => setModalIsOpen(true)}
          >
            Unlock Voting
          </Button>
        ) : (
          <Box className={styles.delegateOverview}>
            <Typography variant="body1">{balance} Votes</Typography>
            <Typography variant="body1">
              Delegated to {humanReadableDelegate}
            </Typography>
            <Button
              className={styles.editDelegateButtonStyle}
              onClick={() => setModalIsOpen(true)}
            >
              Edit Delegate
            </Button>
          </Box>
        )}
      </Box>
      {proposals.map((proposal: IProposal) => (
        <ProposalPreviewCard
          key={proposal.id}
          id={proposal.id}
          description={proposal.title}
          status={proposal.status}
        />
      ))}
    </Box>
  )
}

const Vote: FC<VoteProps> = props => {
  const { proposals } = props
  return (
    <VoteContextProvider>
      <VoteChild proposals={proposals} />
    </VoteContextProvider>
  )
}

export default Vote
