import React, {
  FC,
  createContext,
  useEffect,
  useContext,
  useState,
  useMemo
} from 'react'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import { UINT256, ARBITRUM, OPTIMISM, XDAI } from 'src/config/constants'
import l2OptimismTokenArtifact from 'src/abi/L2_OptimismERC20.json'
import logger from 'src/logger'
import { contractNetworkSlugToChainId } from 'src/utils'

type ConvertContextProps = {
  tokens: Token[]
  selectedToken: Token | undefined
  setSelectedToken: (token: Token) => void
  networks: Network[]
  l2Networks: Network[]
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network | undefined) => void
  sourceNetwork: Network | undefined
  setSourceNetwork: (network: Network) => void
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
  tokens: [],
  selectedToken: undefined,
  setSelectedToken: (token: Token) => {},
  networks: [],
  l2Networks: [],
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network | undefined) => {},
  sourceNetwork: undefined,
  setSourceNetwork: (network: Network) => {},
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
    checkConnectedNetworkId,
    getWriteContract
  } = useWeb3Context()
  const app = useApp()
  let { networks: nets, tokens, contracts, txConfirm } = app
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const canonicalSlug = (network: Network) => {
    if (network?.isLayer1) {
      return ''
    }
    return network?.slug?.replace('HopBridge', '')
  }
  const isHopBridge = (slug: string | undefined) => {
    if (!slug) return false
    return slug.includes('Bridge')
  }
  const l2Networks = nets.filter((network: Network) => !network.isLayer1)
  const networks: Network[] = useMemo(() => {
    const l1Networks = nets.filter((network: Network) => network.isLayer1)
    const l2CanonicalNetworks = l2Networks.map((network: Network) => {
      return new Network({
        name: `Canonical Bridge`,
        slug: network.slug,
        imageUrl: network.imageUrl,
        rpcUrl: network.rpcUrl,
        networkId: network.networkId
      })
    })
    const l2HopBridges = l2Networks.map((network: Network) => {
      return new Network({
        name: `Hop Bridge`,
        slug: `${network.slug}HopBridge`,
        imageUrl: network.imageUrl,
        rpcUrl: network.rpcUrl,
        networkId: network.networkId
      })
    })
    return [...l1Networks, ...l2CanonicalNetworks, ...l2HopBridges]
  }, [nets])
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    l2Networks[0]
  )
  const [sourceNetwork, setSourceNetwork] = useState<Network | undefined>()
  const [destNetwork, setDestNetwork] = useState<Network | undefined>()
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [sourceTokenBalance, setSourceTokenBalance] = useState<number | null>(
    null
  )
  const [destTokenBalance, setDestTokenBalance] = useState<number | null>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const l1Bridge = contracts?.tokens[selectedToken.symbol].kovan.l1Bridge
  const networkPairMap = networks.reduce((obj, network) => {
    if (network.isLayer1) {
      return obj
    }
    if (isHopBridge(network?.slug)) {
      obj[canonicalSlug(network)] = network?.slug
      obj[network?.slug] = canonicalSlug(network)
    }
    return obj
  }, {} as any)
  const calcAltTokenAmount = async (value: string) => {
    if (value) {
      if (!sourceNetwork) {
        return ''
      }
      if (!destNetwork) {
        return ''
      }
      const slug = canonicalSlug(sourceNetwork)
      if (!slug) {
        return value
      }
      const tokenContracts = contracts?.tokens[selectedToken.symbol][slug]
      const router = tokenContracts?.uniswapRouter
      if (networkPairMap[sourceNetwork?.slug] === destNetwork?.slug) {
        let path = [
          tokenContracts?.l2CanonicalToken.address,
          tokenContracts?.l2Bridge.address
        ]
        if (destNetwork?.slug === slug) {
          path = [
            tokenContracts?.l2Bridge.address,
            tokenContracts?.l2CanonicalToken.address
          ]
        }

        const amountsOut = await router?.getAmountsOut(
          parseUnits(value, 18),
          path
        )
        value = Number(formatUnits(amountsOut[1].toString(), 18)).toFixed(2)
      }
    }

    return value
  }

  const convertTokens = async () => {
    try {
      const networkId = Number(sourceNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(null)
      if (!Number(sourceTokenAmount)) {
        return
      }

      if (!sourceNetwork) {
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
        const contractRead = contracts?.getErc20Contract(tokenAddress, signer)
        let contract = await getWriteContract(contractRead)

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
              networkName: canonicalSlug(sourceNetwork)
            })
          )
        }
        await tx?.wait()
        return tx
      }

      const signer = provider?.getSigner()
      const address = await signer?.getAddress()
      const value = parseUnits(sourceTokenAmount, 18).toString()
      let tx: any
      const sourceSlug = canonicalSlug(sourceNetwork)
      const sourceTokenContracts =
        contracts?.tokens[selectedToken.symbol][sourceSlug]

      // source network is L1 ( L1 -> L2 )
      if (sourceNetwork?.isLayer1) {
        // destination network is L2 hop bridge ( L1 -> L2 Hop )
        if (destNetwork && isHopBridge(destNetwork?.slug)) {
          const chainId = contractNetworkSlugToChainId(
            canonicalSlug(destNetwork)
          )

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
              const l1BridgeWrite = await getWriteContract(l1Bridge)
              return l1BridgeWrite?.sendToL2(chainId, address, value)
            }
          })

          // destination network is canonical bridge (L1 -> L2 canonical)
        } else if (destNetwork && !isHopBridge(destNetwork?.slug)) {
          const destSlug = destNetwork?.slug
          const destTokenContracts =
            contracts?.tokens[selectedToken.symbol][destSlug]
          const messenger = destTokenContracts?.l1CanonicalBridge
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            messenger?.address as string
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
              const messengerWrite = await getWriteContract(messenger)
              if (destSlug === ARBITRUM) {
                return messengerWrite?.depositERC20Message(
                  addresses.tokens[selectedToken.symbol][destSlug].arbChain,
                  tokenAddress,
                  address,
                  value
                )
              } else if (destSlug === OPTIMISM) {
                return messengerWrite?.deposit(address, value, true)
              } else if (destSlug === XDAI) {
                return messengerWrite?.relayTokens(tokenAddress, address, value)
              } else {
                throw new Error('not implemented')
              }
            }
          })
        }

        // source network is L2 canonical bridge ( L2 canonical -> L1 or L2 )
      } else if (
        sourceNetwork &&
        !sourceNetwork?.isLayer1 &&
        !isHopBridge(sourceNetwork?.slug)
      ) {
        // destination network is L1 ( L2 canonical -> L1 )
        if (destNetwork?.isLayer1) {
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
              if (sourceSlug === ARBITRUM) {
                const contract = await getWriteContract(
                  sourceTokenContracts?.l2CanonicalToken
                )
                return contract?.withdraw(await signer?.getAddress(), value)
              } else if (sourceSlug === OPTIMISM) {
                const l2Token = await getWriteContract(
                  sourceTokenContracts?.l2CanonicalToken
                )
                return l2Token?.withdraw(value)
              } else if (sourceSlug === XDAI) {
                const destTokenContracts =
                  contracts?.tokens[selectedToken.symbol][sourceSlug]
                const messenger = destTokenContracts?.l2CanonicalBridge
                await approveTokens(
                  selectedToken,
                  sourceTokenAmount,
                  sourceNetwork as Network,
                  messenger?.address as string
                )
                const tokenAddress =
                  sourceTokenContracts?.l2CanonicalToken.address
                const messengerWrite = await getWriteContract(messenger)
                const address = sourceTokenContracts?.l2CanonicalBridge.address
                return sourceTokenContracts?.l2CanonicalToken?.transferAndCall(
                  address,
                  value,
                  '0x'
                )
              } else {
                throw new Error('not implemented')
              }
            }
          })

          // destination network is L2 hop bridge (L2 canonical -> L2 Hop)
        } else if (isHopBridge(destNetwork?.slug)) {
          const router = sourceTokenContracts?.uniswapRouter
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            router?.address as string
          )

          const amountOutMin = '0'
          const path = [
            sourceTokenContracts?.l2CanonicalToken.address,
            sourceTokenContracts?.l2Bridge.address
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
              const routerWrite = await getWriteContract(router)
              return routerWrite?.swapExactTokensForTokens(
                value,
                amountOutMin,
                path,
                address,
                deadline
              )
            }
          })
        }

        // source network is L2 hop bridge ( L2 Hop -> L1 or L2 )
      } else if (isHopBridge(sourceNetwork?.slug) && destNetwork) {
        const router = sourceTokenContracts?.uniswapRouter
        const bridge = sourceTokenContracts?.l2Bridge

        // destination network is L1 ( L2 Hop -> L1 )
        if (destNetwork?.isLayer1) {
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
              const bridgeWrite = await getWriteContract(bridge)
              return bridgeWrite?.send(
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

          // destination network is L2 uniswap ( L1 -> L2 Uniswap )
        } else {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            router?.address as string
          )

          const amountOutMin = '0'
          const path = [
            sourceTokenContracts?.l2Bridge.address,
            sourceTokenContracts?.l2CanonicalToken.address
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
              const routerWrite = await getWriteContract(router)
              return routerWrite?.swapExactTokensForTokens(
                value,
                amountOutMin,
                path,
                address,
                deadline
              )
            }
          })
        }
      }

      if (tx?.hash && sourceNetwork?.name) {
        app?.txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: canonicalSlug(sourceNetwork)
          })
        )
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
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
        tokens,
        selectedToken,
        setSelectedToken,
        networks,
        l2Networks,
        selectedNetwork,
        setSelectedNetwork,
        sourceNetwork,
        setSourceNetwork,
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
