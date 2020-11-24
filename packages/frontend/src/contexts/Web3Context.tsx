import React, {
  FC,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState
} from 'react'
import Onboard from 'bnc-onboard'
import { ethers } from 'ethers'
import Address from '../models/Address'

type Props = {
  onboard: any,
  provider: ethers.providers.Web3Provider | undefined,
  address: Address | undefined,
  requestWallet: () => void
}

const initialState = {
  onboard: undefined,
  provider: undefined,
  address: undefined,
  requestWallet: () => {}
}

const Web3Context = createContext<Props>(initialState)

const Web3ContextProvider: FC = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>()

  const onboard = useMemo(() => {
    return Onboard({
      dappId: '328621b8-952f-4a86-bd39-724ba822d416',
      networkId: 42,
      subscriptions: {
        wallet: wallet => {
          setProvider(new ethers.providers.Web3Provider(wallet.provider))
        }
      }
    })
  }, [setProvider])

  const [address, setAddress] = useState<Address | undefined>()

  const requestWallet = useCallback(() => {
    const _requestWallet = async () => {
      try {
        await onboard.walletSelect()
        await onboard.walletCheck()
      } catch (err) {
        console.error(err)
      }
    }

    _requestWallet()
  }, [onboard])

  useEffect(() => {
    const getAddress = async () => {
      const addressString = await provider?.getSigner().getAddress()
      if (addressString) {
        setAddress(Address.from(addressString))
      }
    }

    getAddress()
  }, [provider])

  return (
    <Web3Context.Provider value={{
      onboard,
      provider,
      address,
      requestWallet
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3Context: () => Props = () => useContext(Web3Context)

export default Web3ContextProvider