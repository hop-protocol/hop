import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Countdown } from './Countdown'
import useContracts from 'src/contexts/AppContext/useContracts'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  headerWrapper: {
    display: 'flex',
    width: '51rem',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  poolSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    columnGap: '10px',
    rowGap: '15px',
    width: '100%',
    justifySelf: 'center',
    justifyItems: 'center'
  },
  poolContainer: {
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
  }

}))

const Earn: FC = () => {
  const styles = useStyles()
  const { stakingRewards } = useContracts([])

  // MOCK DATA
  const mockDate = new Date()
  mockDate.setDate(mockDate.getDate() + 60);

  // MOCK DATA
  const stakingRewardsExist = true
  const stakingInfos = [{
    stakingRewardAddress: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A'
  }]
  const stakingInfosWithBalance = [{
    stakingRewardAddress: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A'
  }]

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Earn
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.headerWrapper}>
        <Typography variant="h6">
          Participating Pools
        </Typography>
        <Countdown exactEnd={mockDate} />
      </Box>
      <Box className={styles.poolSection}>
        <Box className={styles.poolContainer}>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <CircularProgress />
          ) : !stakingRewardsExist ? (
            <span> No active pools </span>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <span> No active pools </span>
          ) : (
            // <span> You are earning! </span>
            <span> { stakingRewards?.address } </span>
            // stakingInfosWithBalance?.map(stakingInfo => {
            //   // need to sort by added liquidity here
            //   return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            // })
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Earn
