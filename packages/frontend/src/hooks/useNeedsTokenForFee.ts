import Network from 'src/models/Network'
import logger from 'src/logger'
import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'

const useNeedsTokenForFee = (network: Network | undefined) => {
  const [needsToken, setNeedsToken] = useState(false)
  const { provider: walletProvider, address } = useWeb3Context()
  const { isSmartContractWallet } = useIsSmartContractWallet()

  useEffect(() => {
    const checkBalance = async () => {
      const provider = network?.provider
      const signer = walletProvider?.getSigner()

      if (!provider || !signer || !address) {
        setNeedsToken(false)
        return
      }

      if (isSmartContractWallet) {
        setNeedsToken(false)
        return
      }

      if (!provider.getBalance) {
        console.error('Provider does not support getBalance', provider)
        setNeedsToken(false)
        return
      }

      const balance = await provider.getBalance(address.address)

      const gasPrice = await provider.getGasPrice()
      const gasNeeded = BigNumber.from('100000')

      const requiredBalance = gasPrice.mul(gasNeeded)
      const _needsToken = balance.lt(requiredBalance)

      setNeedsToken(_needsToken)
    }

    checkBalance().catch(logger.error)
  }, [network, walletProvider, address, isSmartContractWallet])

  return needsToken
}

export default useNeedsTokenForFee
