import React, { useMemo, useState, useEffect } from 'react'
import { useInterval } from 'react-use'
import { BigNumber, Contract } from 'ethers'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import { useWeb3Context } from 'src/contexts/Web3Context'
import merkleRewardsAbi from 'src/abis/MerkleRewards.json'
import { ShardedMerkleTree } from './merkle'
import { networkIdToSlug } from 'src/utils/networks'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { toTokenDisplay } from 'src/utils'
import { formatError } from 'src/utils/format'

interface Token {
  symbol: string
  decimals: number
}

interface Props {
  rewardsContractAddress: string
  merkleBaseUrl: string
  requiredChainId: number
  token: Token
  title: string
}

export function RewardsWidget(props: Props) {
  const { rewardsContractAddress, merkleBaseUrl, requiredChainId, token, title } = props
  const { checkConnectedNetworkId, address, provider, connectedNetworkId } = useWeb3Context()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimableAmount, setClaimableAmount] = useState(BigNumber.from(0))
  const [onchainRoot, setOnchainRoot] = useState('')
  const claimRecipient = address?.address
  const contract = useMemo(() => {
    try {
      if (rewardsContractAddress) {
        let _provider: any = provider
        if (connectedNetworkId !== requiredChainId) {
          _provider = getProviderByNetworkName(networkIdToSlug(requiredChainId))
        }
        return new Contract(rewardsContractAddress, merkleRewardsAbi, _provider)
      }
    } catch (err) {
      console.error(err)
    }
  }, [provider, rewardsContractAddress])

  const getOnchainRoot = async () => {
    try {
      if (contract) {
        const root = await contract.merkleRoot()
        setOnchainRoot(root)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOnchainRoot().catch(console.error)
  }, [contract])

  useInterval(getOnchainRoot, 10 * 1000)

  const getClaimableAmount = async () => {
    try {
      if (!(
        onchainRoot &&
        contract &&
        merkleBaseUrl &&
        claimRecipient
      )) {
        setClaimableAmount(BigNumber.from(0))
        return
      }
      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
      const [entry] = await shardedMerkleTree.getProof(claimRecipient)
      if (!entry) {
        setClaimableAmount(BigNumber.from(0))
        return
      }
      const total = BigNumber.from(entry.balance)
      const withdrawn = await contract.withdrawn(claimRecipient)
      const amount = total.sub(withdrawn)
      setClaimableAmount(amount)
    } catch (err) {
      console.error(err)
      setClaimableAmount(BigNumber.from(0))
    }
    setLoading(false)
  }

  useEffect(() => {
    getClaimableAmount().catch(console.error)
  }, [contract, claimRecipient, onchainRoot, merkleBaseUrl])

  useInterval(getClaimableAmount, 10 * 1000)

  async function claim() {
    try {
      if (!(
        contract &&
        provider &&
        address &&
        claimRecipient &&
        onchainRoot &&
        merkleBaseUrl
      )) {
        return
      }
      const isNetworkConnected = await checkConnectedNetworkId(requiredChainId)
      if (!isNetworkConnected) {
        return
      }

      setClaiming(true)
      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
      const [entry, proof] = await shardedMerkleTree.getProof(claimRecipient)
      if (!entry) {
        throw new Error('no entry')
      }
      const totalAmount = BigNumber.from(entry.balance)
      const tx = await contract.connect(provider.getSigner()).claim(claimRecipient, totalAmount, proof)
      console.log(tx)
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setClaiming(false)
  }

  const claimableAmountDisplay = toTokenDisplay(claimableAmount, token.decimals)

  return (
    <Box maxWidth="500px" margin="0 auto" flexDirection="column" display="flex" justifyContent="center" textAlign="center">
      <Box mb={6}>
        <Typography variant="h4">Rewards</Typography>
      </Box>
      {!claimRecipient && (
        <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
          <Typography variant="body1">
            Please connect wallet
          </Typography>
        </Box>
      )}
      {!!claimRecipient && (
        <Box>
          <Box mb={2}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          {loading && (
            <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          )}
          <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
            <Typography variant="body1">
              Claimable: <strong>{claimableAmountDisplay} {token.symbol}</strong>
            </Typography>
          </Box>
          <Box mb={2}>
            <Button variant="contained" onClick={claim} loading={claiming} disabled={claiming || claimableAmount.eq(0)} highlighted={claimableAmount.gt(0)}>Claim Rewards</Button>
          </Box>
        </Box>
      )}
      {!!error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  )
}
