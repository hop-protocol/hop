import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useInterval } from 'react-use'
import { BigNumber, Contract } from 'ethers'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import { useWeb3Context } from 'src/contexts/Web3Context'
import merkleRewardsAbi from 'src/abis/MerkleRewards.json'
import { formatUnits } from 'ethers/lib/utils'
import { ShardedMerkleTree } from './merkle'
import { config } from './config'

export function MdfWidget() {
  const { checkConnectedNetworkId, address, provider } = useWeb3Context()
  const [error, setError] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimableAmount, setClaimableAmount] = useState('')
  const [onchainRoot, setOnchainRoot] = useState('')
  const [rewardsContractAddress] = useState(config.rewardsContractAddress)
  const [merkleBaseUrl] = useState(config.merkleBaseUrl)
  const contract = useMemo(() => {
    try {
      if (rewardsContractAddress) {
        return new Contract(rewardsContractAddress, merkleRewardsAbi, provider)
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

  useInterval(getOnchainRoot, 5 * 1000)

  const claimRecipient = address?.address

  const getClaimableAmount = async () => {
    try {
      if (!onchainRoot) {
        return
      }
      if (!contract) {
        return
      }
      if (!merkleBaseUrl) {
        return
      }
      if (claimRecipient) {
        const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
        const [entry] = await shardedMerkleTree.getProof(claimRecipient)
        if (!entry) {
          return
        }
        const total = BigNumber.from(entry.balance)
        const withdrawn = await contract.withdrawn(claimRecipient)
        const amount = total.sub(withdrawn)
        setClaimableAmount(formatUnits(amount, 18))
      }
    } catch (err) {
      console.error(err)
      setClaimableAmount('')
    }
  }

  useEffect(() => {
    getClaimableAmount().catch(console.error)
  }, [contract, claimRecipient, onchainRoot, merkleBaseUrl])

  useInterval(getClaimableAmount, 5 * 1000)

  async function claim() {
    try {
      if (!contract) {
        return
      }
      if (!provider) {
        return
      }
      if (!address) {
        return
      }
      if (!claimRecipient) {
        return
      }
      if (!onchainRoot) {
        return
      }
      if (!merkleBaseUrl) {
        return
      }
      setClaiming(true)
      const isNetworkConnected = await checkConnectedNetworkId(config.chainId)
      if (!isNetworkConnected) {
        return
      }

      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
      const [entry, proof] = await shardedMerkleTree.getProof(claimRecipient)
      if (!entry) {
        throw new Error('no entry')
      }
      const totalAmount = BigNumber.from(entry.balance)
console.log(claimRecipient, totalAmount, proof)
      const tx = await contract.connect(provider.getSigner()).claim(claimRecipient, totalAmount, proof)
      console.log(tx)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setClaiming(false)
  }

  return (
    <Box maxWidth="500px" margin="0 auto" flexDirection="column" display="flex" justifyContent="center" textAlign="center">
      <Box mb={6}>
        <Typography variant="h4">Rewards</Typography>
      </Box>
      <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
        <Typography variant="body1">
          Claimable amount: <strong>{claimableAmount || '-'}</strong>
        </Typography>
      </Box>
      <Box mb={2}>
        <Button variant="contained" onClick={claim} disabled={claiming} highlighted={Number(claimableAmount) > 0}>Claim Rewards</Button>
      </Box>
    </Box>
  )
}
