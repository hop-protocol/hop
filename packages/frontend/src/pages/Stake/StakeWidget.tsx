import React, { FC, useState, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Button from 'src/components/buttons/Button'
import useBalance from 'src/hooks/useBalance'

const useStyles = makeStyles(theme => ({
  buttons: {
    marginTop: theme.padding.default
  },
  button: {
    margin: `0 ${theme.padding.light}`
  }
}))

type Props = {
  token: Token
}

const Stake: FC<Props> = props => {
  const styles = useStyles()
  const { token } = props
  const { networks } = useApp()

  const polygon = networks.find(network =>
    network.slug === 'polygon'
  )

  const [amount, setAmount] = useState('')
  const { balance: lpBalance, loading: loadingLpBalance } = useBalance(token, polygon)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AmountSelectorCard
        label="USDC-hUSDC LP"
        value={amount}
        token={token}
        onChange={setAmount}
        title="Polygon"
        balance={lpBalance}
        loadingBalance={loadingLpBalance}
      />
      <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
        <Button
          className={styles.button}
          large
          highlighted
        >
          Approve
        </Button>
        <Button
          className={styles.button}
          large
          disabled
        >
          Stake
        </Button>
      </Box>
    </Box>
  )
}

export default Stake
