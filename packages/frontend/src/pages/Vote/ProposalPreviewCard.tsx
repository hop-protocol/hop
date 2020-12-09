import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import ProposalStatusCard from './ProposalStatusCard'

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
  }
}))

type Props = {
  id: string
  description: string
  status: string
}

const ProposalPreviewCard: FC<Props> = props => {
  const { id, description, status } = props
  const styles = useStyles({ status })

  const history = useHistory()

  const handleClick = () => {
    history.push(`/vote/${id}`)
  }

  return (
    <Box
      alignItems="center"
      className={styles.previewsBox}
      onClick={async event => {
        event.preventDefault()
        handleClick()
      }}
    >
      <Card className={styles.previewCard}>
        <Box alignItems="center" className={styles.previewBox}>
          <Typography variant="subtitle2" color="textSecondary" component="div">
            {id}
          </Typography>
        </Box>
        <Box alignItems="left" className={styles.previewBox}>
          <Typography variant="subtitle2" color="textSecondary" component="div">
            {description}
          </Typography>
        </Box>

        <ProposalStatusCard status={status} />
      </Card>
    </Box>
  )
}

export default ProposalPreviewCard
