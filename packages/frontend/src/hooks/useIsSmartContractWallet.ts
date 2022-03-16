import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { utils } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'

export default function useIsSmartContractWallet(
  customRecipient?: string,
  fromNetwork?: Network,
  toNetwork?: Network
) {
  const { provider, address } = useWeb3Context()
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false)
  const [isGnosisSafeWallet, setIsGnosisSafeWallet] = useState(false)
  const [isRecipientContract, setIsRecipientContract] = useState(false)
  const [isRecipientSelfContract, setIsRecipientSelfContract] = useState(false)
  const { connected, safe } = useSafeAppsSDK()

  useEffect(() => {
    const checkAddress = async () => {
      if (!provider || !address) return

      const code = await provider.getCode(address.address)
      setIsSmartContractWallet(code !== '0x')
    }

    checkAddress()
  }, [provider, address])

  useEffect(() => {
    setIsGnosisSafeWallet(connected)
  }, [connected])

  useEffect(() => {
    if (!(isGnosisSafeWallet && safe && toNetwork && customRecipient)) return

    if (!utils.isAddress(customRecipient)) return

    toNetwork.provider.getCode(customRecipient).then(val => {
      setIsRecipientContract(val !== '0x')
      setIsRecipientSelfContract(safe.safeAddress === customRecipient)
    })
  }, [isGnosisSafeWallet, safe, customRecipient, toNetwork])

  const gnosisEnabled = useMemo(() => {
    return isSmartContractWallet
      ? isGnosisSafeWallet && customRecipient && !isRecipientSelfContract
      : !customRecipient && false
  }, [isSmartContractWallet, isGnosisSafeWallet, customRecipient, isRecipientSelfContract])

  const isCorrectSignerNetwork = useMemo(() => {
    return isSmartContractWallet && fromNetwork?.networkId === safe?.chainId.toString()
  }, [isSmartContractWallet, fromNetwork, safe])

  return {
    isSmartContractWallet,
    isGnosisSafeWallet,
    isRecipientContract,
    isRecipientSelfContract,
    gnosisEnabled,
    safe,
    isCorrectSignerNetwork,
  }
}
