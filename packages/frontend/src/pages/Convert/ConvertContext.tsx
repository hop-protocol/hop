import React, { FC, createContext, useContext, useState, useMemo } from 'react'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import { UINT256, ARBITRUM_MESSENGER_ID } from 'src/config/constants'
import l1OptimismTokenBridgeArtifact from 'src/abi/L1OptimismTokenBridge.json'
import l2OptimismTokenArtifact from 'src/abi/L2_OptimismERC20.json'

type ConvertContextProps = {
  selectedToken: Token | undefined
  sourceNetwork: Network | undefined
  setSourceNetwork: (network: Network) => void
  sourceNetworks: Network[]
  destNetwork: Network | undefined
  setDestNetwork: (network: Network) => void
  sourceTokenAmount: string | undefined
  setSourceTokenAmount: (value: string) => void
  destTokenAmount: string | undefined
  setDestTokenAmount: (value: string) => void
  convertTokens: () => void
  validFormFields: boolean
  calcAltTokenAmount: (value: string) => Promise<string>
  sending: boolean
  sendButtonText: string
  sourceTokenBalance: number | null
  destTokenBalance: number | null
  setSourceTokenBalance: (balance: number | null) => void
  setDestTokenBalance: (balance: number | null) => void
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
}

const ConvertContext = createContext<ConvertContextProps>({
  selectedToken: undefined,
  sourceNetwork: undefined,
  setSourceNetwork: (network: Network) => {},
  sourceNetworks: [],
  destNetwork: undefined,
  setDestNetwork: (network: Network) => {},
  sourceTokenAmount: undefined,
  setSourceTokenAmount: (value: string) => {},
  destTokenAmount: undefined,
  setDestTokenAmount: (value: string) => {},
  convertTokens: () => {},
  validFormFields: false,
  calcAltTokenAmount: async (value: string): Promise<string> => '',
  sending: false,
  sendButtonText: '',
  sourceTokenBalance: null,
  destTokenBalance: null,
  setSourceTokenBalance: (balance: number | null) => {},
  setDestTokenBalance: (balance: number | null) => {},
  error: null,
  setError: (error: string | null | undefined) => {}
})

const ConvertContextProvider: FC = ({ children }) => {
  const {
    provider,
    setRequiredNetworkId,
    connectedNetworkId
  } = useWeb3Context()
  const app = useApp()
  let { networks: nets, tokens, contracts, txConfirm } = app
  const arbitrumDai = contracts?.networks.arbitrum.l2CanonicalToken
  const arbitrumUniswapRouter = contracts?.networks.arbitrum.uniswapRouter
  const arbitrumL1Messenger = contracts?.networks.arbitrum.l1CanonicalBridge
  const arbitrumBridge = contracts?.networks.arbitrum.l2Bridge
  const l1Bridge = contracts?.l1Bridge
  const networks = useMemo(() => {
    const kovanNetwork = nets.find(
      (network: Network) => network.slug === 'kovan'
    ) as Network
    const arbitrumNetwork = nets.find(
      (network: Network) => network.slug === 'arbitrum'
    ) as Network
    const optimismNetwork = nets.find(
      (network: Network) => network.slug === 'optimism'
    ) as Network
    const arbitrumCanonicalBridgeNetwork = new Network({
      name: 'Arbitrum Canonical',
      slug: arbitrumNetwork.slug,
      imageUrl: arbitrumNetwork.imageUrl,
      rpcUrl: arbitrumNetwork.rpcUrl,
      networkId: arbitrumNetwork.networkId
    })
    const arbitrumHopBridgeNetwork = new Network({
      name: 'Arbitrum Hop bridge',
      slug: 'arbitrumHopBridge',
      imageUrl: arbitrumNetwork.imageUrl,
      rpcUrl: arbitrumNetwork.rpcUrl,
      networkId: arbitrumNetwork.networkId
    })
    const optimismCanonicalBridgeNetwork = new Network({
      name: 'Optimism Canonical',
      slug: optimismNetwork.slug,
      imageUrl: optimismNetwork.imageUrl,
      rpcUrl: optimismNetwork.rpcUrl,
      networkId: optimismNetwork.networkId
    })
    return [
      kovanNetwork,
      arbitrumCanonicalBridgeNetwork,
      optimismCanonicalBridgeNetwork,
      arbitrumHopBridgeNetwork
    ]
  }, [nets])
  const [sourceNetworks] = useState<Network[]>(networks)
  tokens = tokens.filter((token: Token) => ['DAI'].includes(token.symbol))
  const [selectedToken] = useState<Token>(tokens[0])
  const [sourceNetwork, setSourceNetwork] = useState<Network | undefined>(
    sourceNetworks[0]
  )
  const [destNetwork, setDestNetwork] = useState<Network | undefined>()
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [sourceTokenBalance, setSourceTokenBalance] = useState<number | null>(
    null
  )
  const [destTokenBalance, setDestTokenBalance] = useState<number | null>(null)
  const [error, setError] = useState<string | null | undefined>()

  const calcAltTokenAmount = async (value: string) => {
    if (value) {
      if (
        (sourceNetwork?.slug === 'arbitrumHopBridge' &&
          destNetwork?.slug === 'arbitrum') ||
        (sourceNetwork?.slug === 'arbitrum' &&
          destNetwork?.slug === 'arbitrumHopBridge')
      ) {
        let path = [
          addresses.networks.arbitrum.l2CanonicalToken,
          addresses.networks.arbitrum.l2Bridge
        ]
        if (destNetwork?.slug === 'arbitrum') {
          path = [
            addresses.networks.arbitrum.l2Bridge,
            addresses.networks.arbitrum.l2CanonicalToken
          ]
        }

        const amountsOut = await arbitrumUniswapRouter?.getAmountsOut(
          parseUnits(value, 18),
          path
        )
        value = Number(formatUnits(amountsOut[1].toString(), 18)).toFixed(2)
      }
      if (
        (sourceNetwork?.slug === 'kovan' && destNetwork?.slug === 'arbitrum') ||
        (sourceNetwork?.slug === 'arbitrum' && destNetwork?.slug === 'kovan')
      ) {
        // value is same
      }
    }

    return value
  }

  const checkWalletNetwork = () => {
    if (sourceNetwork) {
      // react doesn't invoke useEffect if it's the same value,
      // so here we set a dummy value and then retrigger the setState
      // in order to reshow the onboard network change modal
      setRequiredNetworkId('')
      setTimeout(() => {
        setRequiredNetworkId(sourceNetwork?.networkId)
      }, 10)
    }
    return connectedNetworkId === sourceNetwork?.networkId
  }

  const convertTokens = async () => {
    try {
      if (!Number(sourceTokenAmount)) {
        return
      }

      if (!checkWalletNetwork()) {
        return
      }

      setSending(true)
      const approveTokens = async (
        token: Token,
        amount: string,
        network: Network,
        targetAddress: string
      ): Promise<any> => {
        const signer = provider?.getSigner()
        const tokenAddress = token.addressForNetwork(network).toString()
        const contract = contracts?.getErc20Contract(tokenAddress, signer)

        const parsedAmount = parseUnits(amount, token.decimals || 18)
        const approved = await contract?.allowance(
          await signer?.getAddress(),
          targetAddress
        )

        let tx: any
        if (approved.lt(parsedAmount)) {
          tx = await txConfirm?.show({
            kind: 'approval',
            inputProps: {
              amount,
              token
            },
            onConfirm: async (approveAll: boolean) => {
              const approveAmount = approveAll ? UINT256 : parsedAmount
              return contract?.approve(targetAddress, approveAmount)
            }
          })
        }

        if (tx?.hash && sourceNetwork) {
          app?.txHistory?.addTransaction(
            new Transaction({
              hash: tx?.hash,
              networkName: sourceNetwork?.slug
            })
          )
        }
        await tx?.wait()
        return tx
      }

      const signer = provider?.getSigner()
      const address = await signer?.getAddress()
      const value = parseUnits(sourceTokenAmount, 18)

      let tx: any
      if (sourceNetwork?.slug === 'kovan') {
        if (destNetwork?.slug === 'arbitrum') {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            arbitrumL1Messenger?.address as string
          )

          const tokenAddress = selectedToken
            .addressForNetwork(sourceNetwork)
            .toString()

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return arbitrumL1Messenger?.depositERC20Message(
                addresses.networks.arbitrum?.arbChain,
                tokenAddress,
                address,
                value
              )
            }
          })
        } else if (destNetwork?.slug === 'optimism') {
          const l1Provider = provider?.getSigner()
          const optimismL1Messenger = new Contract(
            addresses.networks.optimism.l1CanonicalBridge,
            l1OptimismTokenBridgeArtifact.abi,
            l1Provider
          )

          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            optimismL1Messenger?.address as string
          )

          const tokenAddress = selectedToken
            .addressForNetwork(sourceNetwork)
            .toString()

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return optimismL1Messenger?.deposit(address, value, true)
            }
          })
        } else if (destNetwork?.slug === 'arbitrumHopBridge') {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            l1Bridge?.address as string
          )

          const tokenAddress = selectedToken
            .addressForNetwork(sourceNetwork)
            .toString()

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return l1Bridge?.sendToL2(ARBITRUM_MESSENGER_ID, address, value)
            }
          })
        }
      } else if (sourceNetwork?.slug === 'arbitrum') {
        if (destNetwork?.slug === 'kovan') {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            arbitrumDai?.address as string
          )

          const tokenAddress = selectedToken
            .addressForNetwork(sourceNetwork)
            .toString()

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return arbitrumDai?.withdraw(tokenAddress, value)
            }
          })
        }
        if (destNetwork?.slug === 'arbitrumHopBridge') {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            arbitrumUniswapRouter?.address as string
          )

          const amountOutMin = '0'
          const path = [
            addresses.networks.arbitrum.l2CanonicalToken,
            addresses.networks.arbitrum.l2Bridge
          ]
          const deadline = (Date.now() / 1000 + 300) | 0

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return arbitrumUniswapRouter?.swapExactTokensForTokens(
                value,
                amountOutMin,
                path,
                address,
                deadline
              )
            }
          })
        }
      } else if (sourceNetwork?.slug === 'arbitrumHopBridge') {
        if (destNetwork?.slug === 'arbitrum') {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            arbitrumUniswapRouter?.address as string
          )

          const amountOutMin = '0'
          const path = [
            addresses.networks.arbitrum.l2Bridge,
            addresses.networks.arbitrum.l2CanonicalToken
          ]
          const deadline = (Date.now() / 1000 + 300) | 0

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return arbitrumUniswapRouter?.swapExactTokensForTokens(
                value,
                amountOutMin,
                path,
                address,
                deadline
              )
            }
          })
        } else if (destNetwork?.slug === 'kovan') {
          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return arbitrumBridge?.send(
                '1',
                address,
                value,
                Date.now(),
                '0',
                '0',
                '0'
              )
            }
          })
        }
      } else if (sourceNetwork?.slug === 'optimism') {
        if (destNetwork?.slug === 'kovan') {
          const l2Provider = provider?.getSigner()
          const optimismL2Token = new Contract(
            addresses.networks.optimism.l2CanonicalToken,
            l2OptimismTokenArtifact.abi,
            l2Provider
          )

          tx = await txConfirm?.show({
            kind: 'convert',
            inputProps: {
              source: {
                amount: sourceTokenAmount,
                token: selectedToken
              },
              dest: {
                amount: destTokenAmount,
                token: selectedToken
              }
            },
            onConfirm: async () => {
              return optimismL2Token?.withdraw(value)
            }
          })
        }
      }

      if (tx?.hash && sourceNetwork?.name) {
        app?.txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: sourceNetwork?.slug
          })
        )
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      console.error(err)
    }

    setSending(false)
  }

  const enoughBalance = Number(sourceTokenBalance) >= Number(sourceTokenAmount)
  const validFormFields = !!(
    sourceTokenAmount &&
    destTokenAmount &&
    enoughBalance
  )
  let sendButtonText = 'Convert'
  if (sourceTokenBalance === null) {
    sendButtonText = 'Fetching balance...'
  } else if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  return (
    <ConvertContext.Provider
      value={{
        selectedToken,
        sourceNetwork,
        setSourceNetwork,
        sourceNetworks,
        destNetwork,
        setDestNetwork,
        sourceTokenAmount,
        setSourceTokenAmount,
        destTokenAmount,
        setDestTokenAmount,
        convertTokens,
        validFormFields,
        calcAltTokenAmount,
        sending,
        sendButtonText,
        sourceTokenBalance,
        destTokenBalance,
        setSourceTokenBalance,
        setDestTokenBalance,
        error,
        setError
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
