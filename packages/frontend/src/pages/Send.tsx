import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendIcon from '@material-ui/icons/Send'
import RaisedSelect from '../components/selects/RaisedSelect'
import AmountSelectorCard from '../components/AmountSelectorCard'
import Button from '../components/buttons/Button'

const useStyles = makeStyles(() => ({
  sendSelect: {
    marginBottom: '4.2rem'
  },
  sendLabel: {
    marginRight: '1.8rem'
  },
  downArrow: {
    margin: '1.8rem',
    height: '2.4rem',
    width: '2.4rem'
  },
  detailRow: {
    marginTop: '4.2rem',
    width: '46.0rem'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  }
}))

const Send: FC = () => {
  const styles = useStyles()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" className={styles.sendSelect}>
        <Typography variant="h4" className={styles.sendLabel}>
          Send
        </Typography>
        <RaisedSelect value="ETH">
          <MenuItem value="ETH">
            ETH
          </MenuItem>
          <MenuItem value="DAI">
            DAI
          </MenuItem>
        </RaisedSelect>
      </Box>
      <AmountSelectorCard />
      <ArrowDownIcon color="primary" className={styles.downArrow}/>
      <AmountSelectorCard />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={styles.detailRow}
      >
        <Typography variant="subtitle2" color="textSecondary">
          Rate
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          0.98253
        </Typography>
      </Box>
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        large
        highlighted
      >
        Send
      </Button>
    </Box>
  )
}

export default Send