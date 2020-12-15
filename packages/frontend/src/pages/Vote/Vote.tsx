import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { IProposal } from 'src/config'

import ProposalPreviewCard from 'src/pages/Vote/ProposalPreviewCard'
import DelegateModal from 'src/pages/Vote/DelegateModal/DelegateModal'

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
  }
}))

type VoteProps = {
  proposals: IProposal[]
}

const Vote: FC<VoteProps> = props => {
  const { proposals } = props
  const styles = useStyles()
  const [modalIsOpen, setModalIsOpen] = useState(true) // TODO: Change this back

  // Mock data
  const isDelegated = false

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <DelegateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
      <Box display="flex" alignItems="center" className={styles.headerWrapper}>
        <Typography variant="h6">
          Participating Pools
        </Typography>
        { !isDelegated &&
          <Button
            className={styles.buttonStyle}
            onClick={() => setModalIsOpen(true)}
          >
            Unlock Voting
          </Button>
        }
      </Box>
      {proposals.map((proposal: IProposal) => (
        <ProposalPreviewCard
          id={proposal.id}
          description={proposal.title}
          status={proposal.status}
        />
      ))}
    </Box>
  )
}

export default Vote
