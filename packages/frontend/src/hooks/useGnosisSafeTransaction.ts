import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import useIsSmartContractWallet from './useIsSmartContractWallet'
import { ContractTransaction, utils } from 'ethers'
import { GatewayTransactionDetails as GnosisSafeTx } from '@gnosis.pm/safe-apps-sdk'
import { networkIdToName, wait } from 'src/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useSelectedNetwork } from '.'

export interface GnosisSafeWarning {
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
  const [safeTx, setSafeTx] = useState<GnosisSafeTx>()
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

    toNetwork.provider.getCode(customRecipient).then((val: string) => {
      const isContract = val !== '0x'
      const isSame = safe.safeAddress === customRecipient
      setIsRecipientContract(isContract)
      setIsRecipientSelfContract(isContract && isSame)
    })
  }, [isGnosisSafeWallet, safe, customRecipient, toNetwork])

  // Enables Sending gnosis-safe txs
  const gnosisEnabled = useMemo(() => {
    if (isSmartContractWallet) {
      // require customRecipient if it's gnosis-safe
      return !!(isGnosisSafeWallet && customRecipient)
    }

    return !customRecipient && false
  }, [isSmartContractWallet, isGnosisSafeWallet, customRecipient, isRecipientSelfContract])

  // Checks if source chain == gnosis-safe chain
  const isCorrectSignerNetwork = useMemo(() => {
    return isSmartContractWallet && fromNetwork?.networkId === safe?.chainId
  }, [isSmartContractWallet, fromNetwork, safe])

  // Display warnings to enforce valid source chain and custom recipient
  const gnosisSafeWarning: GnosisSafeWarning = useMemo(() => {
    if (!isGnosisSafeWallet) {
      // is not gnosis-safe
      return noWarning
    }

    if (fromNetwork?.slug && !isCorrectSignerNetwork) {
      // incorrect source chain set
      return {
        severity: 'warning',
        text: `The connected account is detected to be a Gnosis Safe. Please match the "From" network above to the connected Gnosis safe-app network (${networkIdToName(
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
        severity: 'warning',
        text: `The connected account is detected to be a ${
          isGnosisSafeWallet ? 'Gnosis Safe' : 'smart contract wallet'
        }. Please provide a custom recipient to proceed with this transaction.`,
      }
    }

    if (isRecipientSelfContract) {
      // custom recipient is set to self (gnosis-safe)
      return {
        severity: 'info',
        text: `The recipient account is detected to be a Gnosis Safe on the ${toNetwork?.name} network.`,
      }
    }

    if (isRecipientContract) {
      // custom recipient is a smart contract (non gnosis-safe)
      return {
        severity: 'info',
        text: `The recipient account is detected to be a smart contract on the ${toNetwork?.name} network.`,
      }
    }

    return noWarning
  }, [
    isGnosisSafeWallet,
    isCorrectSignerNetwork,
    isRecipientContract,
    isRecipientSelfContract,
    isSmartContractWallet,
    customRecipient,
    safe,
    fromNetwork,
    toNetwork,
  ])

  const getSafeTx = useCallback(
    async (tx: Transaction | ContractTransaction): Promise<GnosisSafeTx | undefined> => {
      try {
        console.log(`getting safe tx:`, tx)
        const safeTransaction = await sdk.txs.getBySafeTxHash(tx.hash)

        if (!safeTransaction) {
          await wait(3000)
          return await getSafeTx(tx)
        }

        if (safeTransaction.txHash) {
          console.log(`safeTx w/ hash!:`, safeTransaction)
          setSafeTx(safeTransaction)
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
    gnosisSafeWarning,
  }
}
