import { isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import logger from 'src/logger'
import { getEnsAddress, getEnsAvatar, getEnsName } from 'src/utils/ens'

export function useEns(addressOrEnsName?: string) {
  const [ensAvatar, setEnsAvatar] = useState<string>()
  const [ensName, setEnsName] = useState<string | null>()
  const [ensAddress, setEnsAddress] = useState<string>()

  useEffect(() => {
    setEnsName('')
    setEnsAddress('')
    setEnsAvatar('')

    async function resolveEns() {
      if (!addressOrEnsName) {
        return
      }

      try {
        if (isAddress(addressOrEnsName)) {
          const _ensName = await getEnsName(addressOrEnsName)
          setEnsName(_ensName)
          setEnsAddress(addressOrEnsName)
        } else {
          const _ensAddress = await getEnsAddress(addressOrEnsName)
          if (_ensAddress) {
            setEnsName(addressOrEnsName)
            setEnsAddress(_ensAddress)
          }
        }
      } catch (err) {
        logger.error(`error during setEnsName/setEnsAddress:`, err)
      }
    }

    resolveEns()
  }, [addressOrEnsName])

  useEffect(() => {
    const ensNameOrAddress = ensName || addressOrEnsName

    if (ensNameOrAddress) {
      getEnsAvatar(ensNameOrAddress)
        .then(setEnsAvatar)
        .catch(err => logger.error(`error during setEnsAvatar:`, err))
    }
  }, [ensName])

  return { ensName, ensAvatar, ensAddress }
}
