import React, { FC, createContext, useContext, useState, useEffect } from 'react'
import { parseEther, parseUnits } from 'ethers/lib/utils'
import { BigNumber, Contract } from 'ethers'
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
  mintToken: (tokenSymbol: string) => void
  mintAmount: string
  setMintAmount: (amount: string) => void
  isMinting: boolean
  tokens: Token[]
  error: string
  setError: (error: string) => void
  success: string
  setSuccess: (error: string) => void
  selectedNetwork: Network
}

const FaucetContext = createContext<FaucetContextProps>({
  mintToken: (tokenSymbol: string) => {},
  mintAmount: '',
  setMintAmount: (amount: string) => {},
  isMinting: false,
  tokens: [],
  error: '',
  setError: (error: string) => {},
  success: '',
  setSuccess: (error: string) => {},
  selectedNetwork: l1Network,
})

const FaucetContextProvider: FC = ({ children }) => {
  const [mintAmount, setMintAmount] = useState<string>('')
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

  const mintToken = async (tokenSymbol: string) => {
    try {
      setError('')
      setSuccess('')
      if (!selectedNetwork?.networkId) return
      const networkId = Number(selectedNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }

      if (!tokenSymbol) return

      let address = addresses.tokens[tokenSymbol][L1_NETWORK]?.l1CanonicalToken
      if (tokenSymbol === 'HOP') {
        address = '0x38aF6928BF1Fd6B3c768752e716C49eb8206e20c' // token/faucet contract
      }
      if (tokenSymbol === 'USDT') {
        address = '0xfad6367E97217cC51b4cd838Cc086831f81d38C2' // token/faucet contract
      }
      if (tokenSymbol === 'DAI') {
        address = '0xb93cba7013f4557cDFB590fD152d24Ef4063485f' // token/faucet contract
      }
      if (tokenSymbol === 'UNI') {
        address = '0x41E5E6045f91B61AACC99edca0967D518fB44CFB' // token/faucet contract
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

      const txOptions: any = {}
      if (tokenSymbol === 'USDT' || tokenSymbol === 'DAI' || tokenSymbol === 'UNI' || tokenSymbol === 'HOP') {
        const oneEth = parseEther('1')
        const tokenRates = {
          USDT: BigNumber.from('2000000000'),
          DAI: BigNumber.from('2000000000000000000000'),
          UNI: BigNumber.from('378071833650000000000'),
          HOP: BigNumber.from('10000000000000000000000'),
        }
        const msgValue = parsedAmount.mul(oneEth).div(tokenRates[tokenSymbol])
        txOptions.value = msgValue
      }
      const tx = await contract?.mint(recipient, parsedAmount, txOptions)
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
        setMintAmount,
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
