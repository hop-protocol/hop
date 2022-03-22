import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { ContractTransaction, utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Transaction from 'src/models/Transaction'
import { networkIdToName, wait } from 'src/utils'
import { GatewayTransactionDetails as GnosisSafeTx } from '@gnosis.pm/safe-apps-sdk'
import { useSelectedNetwork } from '.'
import useIsSmartContractWallet from './useIsSmartContractWallet'
import Network from 'src/models/Network'

interface GnosisSafeWarning {
  severity: 'warning' | 'error' | 'info'
  text: string
}

const noWarning: GnosisSafeWarning = {
  severity: 'info',
  text: '',
}

export function useGnosisSafeTransaction(
  tx?: Transaction,
  customRecipient?: string,
  fromNetwork?: Network,
  toNetwork?: Network
) {
  const { sdk, connected, safe } = useSafeAppsSDK()
  const [safeTx, setSafeTx] = useState<any>()
  const { isMatchingSignerAndSourceChainNetwork } = useSelectedNetwork({ gnosisSafe: safe })
  const [isGnosisSafeWallet, setIsGnosisSafeWallet] = useState(false)
  const [isRecipientContract, setIsRecipientContract] = useState(false)
  const [isRecipientSelfContract, setIsRecipientSelfContract] = useState(false)
  const { isSmartContractWallet } = useIsSmartContractWallet()

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
    if (!isGnosisSafeWallet) {
      // is not gnosis-safe
      return noWarning
    }

    if (fromNetwork?.slug && !isCorrectFromNetwork) {
      // incorrect source chain set
      return {
        severity: 'warning',
        text: `The connected account is detected to be a Gnosis Safe. Please match the "From" network to the connected Gnosis safe-app network (${networkIdToName(
          safe.chainId
        )})`,
      }
    }

    if (!toNetwork?.slug) {
      // no destination chain set
      return noWarning
    }

    if (isSmartContractWallet && !customRecipient) {
      // no custom recipient set
      return {
        severity: 'error',
        text: `The connected account is detected to be a ${
          isGnosisSafeWallet ? 'Gnosis Safe' : 'smart contract wallet'
        }. Please provide a custom recipient to proceed with this transaction.`,
      }
    }

    if (isRecipientSelfContract) {
      // custom recipient is set to self (gnosis-safe)
      return {
        severity: 'error',
        text: `The connected account is detected to be a Gnosis Safe. Please provide a custom recipient that you control on the ${toNetwork?.name} network.`,
      }
    }

    return noWarning
  }, [
    isGnosisSafeWallet,
    isCorrectFromNetwork,
    isRecipientSelfContract,
    isSmartContractWallet,
    customRecipient,
    safe,
    fromNetwork,
    toNetwork,
  ])
  useEffect(() => {
    async function doit() {
      if (tx) {
        try {
          const stx = await sdk.txs.getBySafeTxHash(tx.hash)
          console.log(`stx:`, stx)
          setSafeTx(stx)
        } catch (error) {
          console.log(`error:`, error)
        }
      }
    }

    if (connected && tx) {
      doit()
    }
  }, [connected, tx])

  const getSafeTx = useCallback(
    async (tx: Transaction | ContractTransaction): Promise<GnosisSafeTx | undefined> => {
      try {
        console.log(`getting safe tx:`, tx)
        const safeTransaction = await sdk.txs.getBySafeTxHash(tx.hash)
        if (!safeTransaction) {
          await wait(3000)
          return getSafeTx(tx)
        }
        // console.log(`safeTransaction:`, safeTransaction)
        if (safeTransaction.txHash) {
          console.log(`safeTx w/ hash!:`, safeTransaction)
          return safeTransaction
        }
      } catch (error) {
        console.log(`error:`, error)
      }
      await wait(2000)
      return getSafeTx(tx)
    },
    [sdk, connected]
  )

  return {
    safe,
    safeTx,
    connected,
    getSafeTx,
    isGnosisSafeWallet,
    isRecipientContract,
    isRecipientSelfContract,
    gnosisEnabled,
    isCorrectSignerNetwork,
    isCorrectFromNetwork,
    gnosisSafeWarning,
  }
}
