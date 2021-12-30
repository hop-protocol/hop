import { useEffect, useState } from 'react'
import logger from 'src/logger'
import Address from 'src/models/Address'
import { getEnsAvatar, getEnsName } from 'src/utils/ens'

export function useEns(address?: Address) {
  const [ensAvatar, setEnsAvatar] = useState<string>()
  const [ensName, setEnsName] = useState<string>()

  useEffect(() => {
    if (address?.address) {
      try {
        getEnsName(address.address).then(en => en && setEnsName(en))
      } catch (err) {
        logger.error(`error during setEnsName:`, err)
      }
    }
  }, [address?.address])

  useEffect(() => {
    const addrOrEnsName = ensName || address?.address

    if (addrOrEnsName) {
      try {
        getEnsAvatar(addrOrEnsName).then(setEnsAvatar)
      } catch (err) {
        logger.error(`error during setEnsAvatar:`, err)
      }
    }
  }, [address, ensName])

  return { ensName, ensAvatar }
}
