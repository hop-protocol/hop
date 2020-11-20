import React, { FC, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import LargeTextField from '../../components/LargeTextField'
import FlatSelect from '../../components/selects/FlatSelect'
import Network from '../../models/Network'
import Token from '../../models/Token'
import { OFFCHAIN_LABS_LOGO_URL as offchainLabsLogoUrl } from '../../config/constants'
import { OPTIMISM_LOGO_URL as optimismLogoUrl } from '../../config/constants'
import { MAINNET_LOGO_URL as mainnetLogoUrl } from '../../config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box'
  },
  topRow: {
    marginBottom: '1.8rem'
  },
  networkLabel: {
    marginLeft: theme.padding.extraLight
  },
  networkIcon: {
    height: '3.6rem'
  },
  greyCircle: {
    padding: '1.8rem',
    borderRadius: '1.8rem',
    backgroundColor: '#C4C4C4'
  }
}))

type Props = {
  value: string,
  balance?: string,
  token?: Token,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  selectedNetwork?: Network,
  networkOptions: Network[],
  onNetworkChange: (network?: Network) => void
}

const AmountSelectorCard: FC<Props> = (props) => {
  const {
    value,
    balance,
    token,
    onChange,
    selectedNetwork,
    networkOptions,
    onNetworkChange
  } = props
  const styles = useStyles()

  return (
    <Card className={styles.root}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" className={styles.topRow}>
        <Typography variant="subtitle2" color="textSecondary">
          From
        </Typography>
        {balance ?
          <Typography variant="subtitle2" color="textSecondary">
            Balance: {balance}
          </Typography> :
          null
        }
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <FlatSelect value={selectedNetwork?.name || "default"} onChange={ event => {
            const network = networkOptions.find( _network => 
              _network.name === event.target.value
            )
            onNetworkChange(network)
          }}>
            <MenuItem value="default">
              <Box display="flex" flexDirection="row" alignItems="center">
                <div className={styles.greyCircle} />
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Select Network
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="kovan">
              <Box display="flex" flexDirection="row" alignItems="center">
                <img src={mainnetLogoUrl} className={styles.networkIcon} alt="kovan" />
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Kovan
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="optimism">
              <Box display="flex" flexDirection="row" alignItems="center">
                <img src={optimismLogoUrl} className={styles.networkIcon} alt="optimism" />
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Optimism
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="arbitrum">
              <Box display="flex" flexDirection="row" alignItems="center">
                <img src={offchainLabsLogoUrl} className={styles.networkIcon} alt="arbitrum" /> 
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Arbitrum
                </Typography> 
              </Box>
            </MenuItem>
          </FlatSelect>
        </Grid>
        <Grid item xs={6}>
          <LargeTextField
            value={value}
            onChange={onChange}
            placeholder="0.0"
            units={token?.symbol}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AmountSelectorCard