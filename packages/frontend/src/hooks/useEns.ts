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

    if (!addressOrEnsName) {
      return
    }

    try {
      if (isAddress(addressOrEnsName)) {
        getEnsName(addressOrEnsName).then(setEnsName)
      } else {
        getEnsAddress(addressOrEnsName).then(resolvedAddress => {
          if (resolvedAddress) {
            setEnsName(addressOrEnsName)
            setEnsAddress(resolvedAddress)
          }
        })
      }
    } catch (err) {
      logger.error(`error during setEnsName/setEnsAddress:`, err)
    }
  }, [addressOrEnsName])

  useEffect(() => {
    const ensNameOrAddress = ensName || addressOrEnsName

    if (ensNameOrAddress) {
      try {
        getEnsAvatar(ensNameOrAddress).then(setEnsAvatar)
      } catch (err) {
        logger.error(`error during setEnsAvatar:`, err)
      }
    }
  }, [ensName])

  return { ensName, ensAvatar, ensAddress }
}
