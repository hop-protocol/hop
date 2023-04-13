import React, { FC, createContext, useContext, useState, useEffect } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { Contract } from 'ethers'
import erc20Abi from '@hop-protocol/core/abi/static/ERC20Mintable.json'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Transaction from 'src/models/Transaction'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { L1_NETWORK } from 'src/utils/constants'
import { formatError } from 'src/utils/format'
import { l1Network } from 'src/config/networks'
import { addresses } from 'src/config'
import { getTokenDecimals } from 'src/utils/tokens'

type FaucetContextProps = {
  mintToken: () => void
  mintAmount: string
  isMinting: boolean
  tokens: Token[]
  error: string
  setError: (error: string) => void
  success: string
  setSuccess: (error: string) => void
  selectedNetwork: Network
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: () => {},
  mintAmount: '',
  isMinting: false,
  tokens: [],
  error: '',
  setError: (error: string) => {},
  success: '',
  setSuccess: (error: string) => {},
  selectedNetwork: l1Network,
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount] = useState<string>('10')
  const [isMinting, setMinting] = useState<boolean>(false)
  const { selectedBridge, txHistory, tokens } = useApp()
  const selectedNetwork = l1Network
  const { checkConnectedNetworkId, address, provider } = useWeb3Context()
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    setError('')
    setSuccess('')
  }, [selectedBridge])

  const mintToken = async () => {
    try {
      setError('')
      setSuccess('')
      if (!selectedNetwork?.networkId) return
      const networkId = Number(selectedNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }

      const tokenSymbol = selectedBridge.getTokenSymbol()
      if (!tokenSymbol) return

      let address = addresses.tokens[tokenSymbol][L1_NETWORK]?.l1CanonicalToken
      if (tokenSymbol === 'HOP') {
        address = '0x4ab0f372818d9efe2027F1Cc7bC899c539E39073' // faucet contract
      } else if (tokenSymbol === 'USDC') {
        address = '0x1C1cb8744633ce0F785C5895389dFA04DE5C1acE' // faucet contract
      }
      if (tokenSymbol === 'USDC') {
        address = '0x1C1cb8744633ce0F785C5895389dFA04DE5C1acE' // faucet contract
      }
      if (!address) {
        return
      }

      if (!provider) {
        return
      }

      const signer = provider?.getSigner()
      if (!signer) {
        return
      }

      setMinting(true)
      const recipient = await signer.getAddress()
      const tokenDecimals = getTokenDecimals(tokenSymbol)
      const parsedAmount = parseUnits(mintAmount, tokenDecimals)
      const contract = new Contract(address, erc20Abi, signer)

      const tx = await contract?.mint(recipient, parsedAmount)
      logger.debug('mint:', tx?.hash)

      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: L1_NETWORK,
        })
      )
      await tx?.wait()
      setSuccess(`Successfully minted ${mintAmount} ${tokenSymbol}`)
    } catch (err: any) {
      setError(formatError(err, selectedNetwork))
      logger.error(err)
    }
    setMinting(false)
  }

  return (
    <FaucetContext.Provider
      value={{
        mintToken,
        mintAmount,
        isMinting,
        selectedNetwork,
        tokens,
        error,
        setError,
        success,
        setSuccess
      }}
    >
      {children}
    </FaucetContext.Provider>
  )
}

export const useFaucet = () => useContext(FaucetContext)

export default FaucetContextProvider
