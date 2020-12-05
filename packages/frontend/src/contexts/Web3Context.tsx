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
import Address from 'src/models/Address'
import { blocknativeDappid, l1NetworkId } from 'src/config'

type Props = {
  onboard: any
  provider: ethers.providers.Web3Provider | undefined
  address: Address | undefined
  requiredNetworkId: string
  setRequiredNetworkId: (networkId: string) => void
  requestWallet: () => void
}

const initialState = {
  onboard: undefined,
  provider: undefined,
  address: undefined,
  requiredNetworkId: '',
  setRequiredNetworkId: (networkId: string) => {},
  requestWallet: () => {}
}

const Web3Context = createContext<Props>(initialState)

const Web3ContextProvider: FC = ({ children }) => {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >()
  const [requiredNetworkId, setRequiredNetworkId] = useState<string>('')
  const [walletNetworkId, setWalletNetworkId] = useState<string>('')
  const onboard = useMemo(() => {
    const instance = Onboard({
      dappId: blocknativeDappid,
      networkId: Number(l1NetworkId),
      subscriptions: {
        wallet: (wallet: any) => {
          setProvider(new ethers.providers.Web3Provider(wallet.provider))
        },
        network: (walletNetworkId: number) => {
          setWalletNetworkId(walletNetworkId.toString())
        }
      }
    })

    return instance
  }, [setProvider, setWalletNetworkId])

  useEffect(() => {
    onboard.config({ networkId: Number(requiredNetworkId) })
    if (onboard.getState().address) {
      onboard.walletCheck()
    }
  }, [onboard, requiredNetworkId, walletNetworkId])

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
    <Web3Context.Provider
      value={{
        onboard,
        provider,
        address,
        requiredNetworkId,
        setRequiredNetworkId,
        requestWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3Context: () => Props = () => useContext(Web3Context)

export default Web3ContextProvider
