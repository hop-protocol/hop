import { useEffect, useState } from 'react'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { BigNumber } from 'ethers'

const useNeedsTokenForFee = (network: Network | undefined) => {
  const [needsToken, setNeedsToken] = useState(false)
  const { provider: walletProvider } = useWeb3Context()

  useEffect(() => {
    const checkBalance = async () => {
      const provider = network?.provider
      const signer = walletProvider?.getSigner()

      if (
        !provider ||
        !signer ||
        !network?.requiresGas
      ) {
        setNeedsToken(false)
        return
      }

      const balance = await provider.getBalance(await signer?.getAddress())

      const gasPrice = await provider.getGasPrice()
      const gasNeeded = BigNumber.from('100000')

      const requiredBalance = gasPrice.mul(gasNeeded)
      const _needsToken = balance.lt(requiredBalance)

      setNeedsToken(_needsToken)
    }

    checkBalance()
  }, [network, walletProvider])

  return needsToken
}

export default useNeedsTokenForFee
