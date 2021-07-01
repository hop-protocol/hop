import React, { FC, useState, useMemo } from 'react'
import { BigNumber, Contract } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Button from 'src/components/buttons/Button'
import useBalance from 'src/hooks/useBalance'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { UINT256 } from 'src/constants'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import useStakeBalance from 'src/pages/Stake/useStakeBalance'
import { toTokenDisplay } from 'src/utils'
import Alert from 'src/components/alert/Alert'
import usePollValue from 'src/hooks/usePollValue'
import MuiButton from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  buttons: {
    marginTop: theme.padding.default
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    width: '17.5rem'
  },
  claimButton: {
    marginTop: theme.padding.default
  },
  alert: {
    marginTop: theme.padding.default
  },
  withdrawButton: {
    marginTop: theme.padding.light,
    opacity: 0.5
  }
}))

type Props = {
  network: Network | undefined
  stakingToken: Token | undefined
  rewardsToken: Token | undefined
  stakingRewards: Contract | undefined
}

const StakeWidget: FC<Props> = props => {
  const styles = useStyles()
  const {
    network,
    stakingToken,
    rewardsToken,
    stakingRewards
  } = props
  const { networks, txConfirm, txHistory } = useApp()
  const { checkConnectedNetworkId, address } = useWeb3Context()
  const { stakeBalance } = useStakeBalance(stakingRewards, address)

  const formattedStakeBalance = toTokenDisplay(stakeBalance, stakingToken?.decimals)

  const earned = usePollValue<BigNumber>(async () => {
    if (!address) return undefined
    return stakingRewards?.earned(address.toString())
  }, 5e3)

  const formattedEarned = toTokenDisplay(earned, rewardsToken?.decimals, rewardsToken?.symbol)

  const polygon = networks.find(network =>
    network.slug === 'polygon'
  )

  const { balance: lpBalance, loading: loadingLpBalance } = useBalance(stakingToken, polygon)
  const [amount, setAmount] = useState('')
  const parsedAmount = (amount && stakingToken)
    ? parseUnits(amount, stakingToken.decimals)
    : undefined

  const allowance = useAsyncMemo(async () => {
    if (!stakingRewards) {
      return undefined
    }
    return stakingToken?.allowance(stakingRewards.address)
  }, [stakingToken, stakingRewards])

  const needsApproval = useMemo(() => {
    if (!allowance || !parsedAmount) return undefined
    return allowance.lt(parsedAmount)
  }, [allowance, parsedAmount])

  const isStakeEnabled = useMemo(() => {
    if (!parsedAmount || !lpBalance) return false
    if (needsApproval) return false
    if (parsedAmount.gt(lpBalance)) return false
    return true
  }, [parsedAmount, lpBalance, needsApproval])

  const warning = useMemo(() => {
    if (!parsedAmount || !lpBalance) return undefined
    if (parsedAmount.gt(lpBalance)) {
      return 'Insufficient balance'
    }
  }, [parsedAmount, lpBalance])

  const approve = async () => {
    if (
      !stakingRewards ||
      !network ||
      !stakingToken
    ) {
      throw new Error('Undefined approval parameter')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const tx = await txConfirm?.show({
      kind: 'approval',
      inputProps: {
        tagline: `Allow Hop to spend your ${stakingToken.symbol} on ${network?.slug}`,
        amount: amount,
        token: stakingToken.symbol
      },
      onConfirm: async (approveAll: boolean) => {
        const approveAmount = approveAll ? UINT256 : parsedAmount
        return stakingToken.approve(
          stakingRewards?.address,
          approveAmount
        )
      }
    })

    await tx?.wait()
    if (tx?.hash && network) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx.hash,
          networkName: network.slug,
          token: stakingToken
        })
      )
    }
  }

  const stake = async () => {
    if (!stakingRewards) {
      throw new Error('StakingRewards not instantiated')
    }

    if (!network) {
      throw new Error('Network must be defined')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const tx = await txConfirm?.show({
      kind: 'stake',
      inputProps: {
        amount: amount,
        token: stakingToken
      },
      onConfirm: async () => {
        return stakingRewards.stake(parsedAmount)
      }
    })

    if (tx?.hash && network) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx.hash,
          networkName: network.slug,
          token: stakingToken
        })
      )
    }
  }

  const claim = async () => {
    if (!stakingRewards) {
      throw new Error('StakingRewards not instantiated')
    }

    if (!network) {
      throw new Error('Network must be defined')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    await stakingRewards.getReward()
  }

  const withdraw = async () => {
    if (
      !stakingRewards ||
      !network ||
      !stakeBalance
    ) {
      throw new Error('Missing withdraw param')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const tx = await txConfirm?.show({
      kind: 'withdrawStake',
      inputProps: {
        token: stakingToken,
        amount: formattedStakeBalance
      },
      onConfirm: async (amountPercent: number) => {
        if (!amountPercent) return

        if (amountPercent === 100) {
          return stakingRewards.exit()
        }

        const withdrawAmount = stakeBalance.mul(amountPercent).div(100)

        return stakingRewards.withdraw(withdrawAmount)
      }
    })

    if (tx?.hash && network) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx.hash,
          networkName: network.slug,
          token: stakingToken
        })
      )
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AmountSelectorCard
        label={`Staked: ${formattedStakeBalance}`}
        value={amount}
        token={stakingToken}
        onChange={setAmount}
        title="USDC-hUSDC LP"
        balance={lpBalance}
        loadingBalance={loadingLpBalance}
      />
      <Alert severity="warning" text={warning} className={styles.alert}/>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          className={styles.claimButton}
          large
          highlighted
          onClick={claim}
        >
          Claim {formattedEarned}
        </Button>
        <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
          <Button
            className={styles.button}
            large
            highlighted={!!needsApproval}
            disabled={!needsApproval}
            onClick={approve}
          >
            Approve
          </Button>
          <Button
            className={styles.button}
            large
            highlighted={needsApproval === false}
            disabled={!isStakeEnabled}
            onClick={stake}
          >
            Stake
          </Button>
        </Box>
        {earned?.gt(0) && (
          <MuiButton
            className={styles.withdrawButton}
            onClick={withdraw}
          >
            Withdraw
          </MuiButton>
        )}
      </Box>
    </Box>
  )
}

export default StakeWidget
