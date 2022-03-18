import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Color } from '@material-ui/core'
import { utils } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import { networkIdToName } from 'src/utils'

interface GnosisSafeWarning {
  severity: 'warning' | 'error' | 'info'
  text: string
}

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

  const isCorrectFromNetwork = useMemo(() => {
    return isSmartContractWallet && fromNetwork?.networkId === safe?.chainId.toString()
  }, [isSmartContractWallet, fromNetwork, safe])

  const gnosisSafeWarning: GnosisSafeWarning = useMemo(() => {
    if (isGnosisSafeWallet && !isCorrectFromNetwork) {
      return {
        severity: 'warning',
        text: `The connected account is detected to be a Gnosis Safe. Please match the "From" network to the connected Gnosis safe-app network (${networkIdToName(
          safe.chainId
        )})`,
      }
    }

    if (isGnosisSafeWallet && isCorrectFromNetwork && !toNetwork?.slug) {
      return {
        severity: 'info',
        text: ``,
      }
    }

    if (isGnosisSafeWallet && isRecipientSelfContract) {
      return {
        severity: 'error',
        text: `The connected account is detected to be a Gnosis Safe. Please provide a custom recipient that you control on the ${toNetwork?.name} network.`,
      }
    }

    if (isSmartContractWallet && !customRecipient) {
      return {
        severity: 'error',
        text: `The connected account is detected to be a ${
          isGnosisSafeWallet ? 'Gnosis Safe' : 'smart contract wallet'
        }. Please provide a custom recipient to proceed with this transaction.`,
      }
    }

    return {
      severity: 'info',
      text: '',
    }

    // isGnosisSafeWallet &&
    //     !isCorrectSignerNetwork &&
    //     `The connect acount is detected to be a Gnosis Safe. Please match your signer (e.g. MetaMask) to the connect Gnosis safe-app network (${networkIdToName(
    //       safe.chainId
    //     )})`}
  }, [
    isGnosisSafeWallet,
    isCorrectFromNetwork,
    isRecipientSelfContract,
    isSmartContractWallet,
    customRecipient,
    safe,
  ])

  return {
    isSmartContractWallet,
    isGnosisSafeWallet,
    isRecipientContract,
    isRecipientSelfContract,
    gnosisEnabled,
    safe,
    isCorrectSignerNetwork,
    isCorrectFromNetwork,
    gnosisSafeWarning,
  }
}
