import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { ContractTransaction } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import Transaction from 'src/models/Transaction'
import { wait } from 'src/utils'
import { GatewayTransactionDetails as GnosisSafeTx } from '@gnosis.pm/safe-apps-sdk'

export function useGnosisSafeTransaction(tx?: Transaction) {
  const { sdk, connected, safe } = useSafeAppsSDK()
  const [safeTx, setSafeTx] = useState<any>()

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
  }
}
