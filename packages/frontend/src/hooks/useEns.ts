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
        getEnsName(address.address).then(ensName =>
          setEnsName(ensName.startsWith('0x') ? address.truncate() : ensName)
        )
        getEnsAvatar(address.address).then(avatar => avatar && setEnsAvatar(avatar))
      } catch (err) {
        logger.error(`error during useEns:`, err)
      }
    }
  }, [address?.address])

  return { ensName, ensAvatar }
}
