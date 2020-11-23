import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box'
  },
}))

const GovernanceOverviewCard: FC = () => {
  const styles = useStyles()

  return (
    <Card className={styles.root}>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <b>Hop Governance</b>

        <br />

        HOP tokens represent voting shares in Hop governance. You can vote on each proposal yourself or delegate your votes to a third party.

        <br />
        <br />

        Read more about Hop governance.
      </Box>
    </Card>
  )
}

export default GovernanceOverviewCard