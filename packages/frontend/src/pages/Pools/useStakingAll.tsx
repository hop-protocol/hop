import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { StakingRewards__factory } from '@hop-protocol/core/contracts'
import { commafy, findNetworkBySlug } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'
import { metadata, hopStakingRewardsContracts, reactAppNetwork } from 'src/config'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'

export function useStakingAll () {
  const { sdk, txConfirm } = useApp()
  const { checkConnectedNetworkId, walletConnected, address } = useWeb3Context()
  const accountAddress = address?.address
  const [totalEarnedBn, setTotalEarnedBn] = useState<BigNumber>(BigNumber.from(0))
  const [txList, setTxList] = useState<any[]>([])
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  const rewardsTokenSymbol = 'HOP'
  const rewardsTokenImageUrl = metadata.tokens[rewardsTokenSymbol]?.image

  useEffect(() => {
    async function update() {
      if (!(walletConnected && accountAddress && sdk)) {
        setTotalEarnedBn(BigNumber.from(0))
        return
      }
      const promises : any[] = []
      const contracts = hopStakingRewardsContracts?.[reactAppNetwork]
      let _totalEarnedBn = BigNumber.from(0)
      const _txList :any [] = []
      for (const chainSlug in contracts) {
        for (const tokenSymbol in contracts[chainSlug]) {
          promises.push(async () => {
            try {
              const address = contracts[chainSlug][tokenSymbol]
              const _provider = await sdk.getSignerOrProvider(chainSlug)
              const contract = StakingRewards__factory.connect(address, _provider)
              const earned = await contract?.earned(accountAddress)
              _totalEarnedBn = _totalEarnedBn.add(earned)
              if (earned.gt(0)) {
                const network = findNetworkBySlug(chainSlug)!
                if (network) {
                  _txList.push({
                    label: `Claim ${rewardsTokenSymbol} on ${network.name}`,
                    fn: async () => {
                      const networkId = Number(network.networkId)
                      const isNetworkConnected = await checkConnectedNetworkId(networkId)
                      if (!isNetworkConnected) {
                        throw new Error('wrong network connected')
                      }
                      const _provider = await sdk.getSignerOrProvider(chainSlug)
                      const contract = StakingRewards__factory.connect(address, _provider)
                      return contract?.getReward()
                    }
                  })
                }
              }
            } catch (err: any) {
              if (!/(Transaction reverted|noNetwork)/.test(err.message)) {
                console.error('useStakingAll error:', err)
              }
            }
          })
        }
      }
      await Promise.all(promises.map(fn => fn()))
      setTotalEarnedBn(_totalEarnedBn)
      setTxList(_txList)
    }

    update().catch(console.error)
  }, [walletConnected, sdk, accountAddress])

  async function claim () {
    try {
      setIsClaiming(true)
      await txConfirm?.show({
        kind: 'txList',
        inputProps: {
          title: 'Claim All',
          txList
        },
        onConfirm: async () => {
        },
      })
    } catch (err) {
    }
    setIsClaiming(false)
  }

  const canClaim = totalEarnedBn?.gt(0) ?? false
  const earnedAmountFormatted = totalEarnedBn ? `${commafy(formatUnits(totalEarnedBn.toString(), 18), 5)} ${rewardsTokenSymbol}` : '-'

  return {
    canClaim,
    claim,
    earnedAmountFormatted,
    isClaiming,
    rewardsTokenImageUrl,
    rewardsTokenSymbol,
  }
}
