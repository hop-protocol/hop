import React, { FC, createContext, useContext, useState, useMemo } from 'react'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses, optimismNetworkId } from 'src/config'
import {
  UINT256,
  ARBITRUM,
  OPTIMISM,
  ARBITRUM_MESSENGER_ID
} from 'src/config/constants'
import l1OptimismTokenBridgeArtifact from 'src/abi/L1OptimismTokenBridge.json'
import l2OptimismTokenArtifact from 'src/abi/L2_OptimismERC20.json'
import logger from 'src/logger'

type ConvertContextProps = {
  selectedToken: Token | undefined
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network | undefined) => void
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
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network | undefined) => {},
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
  const { provider, getWriteContract } = useWeb3Context()
  const app = useApp()
  let { networks: nets, tokens, contracts, txConfirm } = app
  const arbitrumDai = contracts?.networks.arbitrum.l2CanonicalToken
  const arbitrumUniswapRouter = contracts?.networks.arbitrum.uniswapRouter
  const optimismUniswapRouter = contracts?.networks.optimism.uniswapRouter
  const arbitrumL1Messenger = contracts?.networks.arbitrum.l1CanonicalBridge
  const l1Bridge = contracts?.l1Bridge

  const optimismL1Messenger = useMemo(() => {
    return new Contract(
      addresses.networks.optimism.l1CanonicalBridge,
      l1OptimismTokenBridgeArtifact.abi,
      provider?.getSigner()
    )
  }, [provider])
  const networks = useMemo(() => {
    const l1Network = nets.find(
      (network: Network) => network.isLayer1
    ) as Network
    const arbitrumNetwork = nets.find(
      (network: Network) => network.slug === ARBITRUM
    ) as Network
    const optimismNetwork = nets.find(
      (network: Network) => network.slug === OPTIMISM
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
    const optimismHopBridgeNetwork = new Network({
      name: 'Optimism Hop bridge',
      slug: 'optimismHopBridge',
      imageUrl: optimismNetwork.imageUrl,
      rpcUrl: optimismNetwork.rpcUrl,
      networkId: optimismNetwork.networkId
    })
    return [
      l1Network,
      arbitrumCanonicalBridgeNetwork,
      optimismCanonicalBridgeNetwork,
      arbitrumHopBridgeNetwork,
      optimismHopBridgeNetwork
    ]
  }, [nets])
  const [sourceNetworks] = useState<Network[]>(networks)
  tokens = tokens.filter((token: Token) => ['DAI'].includes(token.symbol))
  const [selectedToken] = useState<Token>(tokens[0])
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    undefined
  )
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

  const networkPairMap: any = {
    arbitrum: 'arbitrumHopBridge',
    optimism: 'optimismHopBridge',
    arbitrumHopBridge: 'arbitrum',
    optimismHopBridge: 'optimism'
  }
  const routers: any = {
    arbitrum: arbitrumUniswapRouter,
    optimism: optimismUniswapRouter
  }
  const messengers: any = {
    arbitrum: arbitrumL1Messenger,
    optimism: optimismL1Messenger
  }
  const chainIds: any = {
    arbitrum: ARBITRUM_MESSENGER_ID,
    optimism: optimismNetworkId
  }
  const canonicalSlug: any = {
    arbitrum: 'arbitrum',
    optimism: 'optimism',
    arbitrumHopBridge: 'arbitrum',
    optimismHopBridge: 'optimism'
  }
  const isHopBridge = (slug: string | undefined) => {
    if (!slug) return false
    return slug.includes('Bridge')
  }

  const calcAltTokenAmount = async (value: string) => {
    if (value) {
      if (!sourceNetwork) {
        return ''
      }
      if (!destNetwork) {
        return ''
      }
      const slug = canonicalSlug[sourceNetwork?.slug]
      if (!slug) {
        return value
      }
      const router = routers[slug]
      if (networkPairMap[sourceNetwork?.slug] === destNetwork?.slug) {
        let path = [
          addresses.networks[slug].l2CanonicalToken,
          addresses.networks[slug].l2Bridge
        ]
        if (destNetwork?.slug === slug) {
          path = [
            addresses.networks[slug].l2Bridge,
            addresses.networks[slug].l2CanonicalToken
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
              networkName: sourceNetwork?.slug
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
      const sourceSlug = canonicalSlug[sourceNetwork?.slug]

      // source network is L1 ( L1 -> L2 )
      if (sourceNetwork?.isLayer1) {
        // destination network is L2 hop bridge ( L1 -> L2 Hop )
        if (destNetwork && isHopBridge(destNetwork?.slug)) {
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
              return l1BridgeWrite?.sendToL2(
                chainIds[canonicalSlug[destNetwork?.slug]],
                address,
                value
              )
            }
          })

          // destination network is canonical bridge (L1 -> L2 canonical)
        } else if (destNetwork && !isHopBridge(destNetwork?.slug)) {
          const destSlug = destNetwork?.slug
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            messengers[destSlug].address as string
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
              if (destSlug === ARBITRUM) {
                const messenger = messengers[destSlug]
                const messengerWrite = await getWriteContract(messenger)
                return messengerWrite?.depositERC20Message(
                  addresses.networks.arbitrum?.arbChain,
                  tokenAddress,
                  address,
                  value
                )
              } else if (destSlug === OPTIMISM) {
                return messengers[destSlug]?.deposit(address, value, true)
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
              if (sourceSlug === ARBITRUM) {
                const arbitrumDaiWrite = await getWriteContract(arbitrumDai)
                return arbitrumDaiWrite?.withdraw(tokenAddress, value)
              } else if (sourceSlug === OPTIMISM) {
                const l2Provider = provider?.getSigner()
                const optimismL2Token = new Contract(
                  addresses.networks.optimism.l2CanonicalToken,
                  l2OptimismTokenArtifact.abi,
                  l2Provider
                )
                const optimismL2TokenWrite = await getWriteContract(
                  optimismL2Token
                )
                return optimismL2TokenWrite?.withdraw(value)
              }
            }
          })

          // destination network is L2 hop bridge (L2 canonical -> L2 Hop)
        } else if (isHopBridge(destNetwork?.slug)) {
          const router = routers[sourceSlug]
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            router?.address as string
          )

          const amountOutMin = '0'
          const path = [
            addresses.networks[sourceSlug].l2CanonicalToken,
            addresses.networks[sourceSlug].l2Bridge
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
        const destNetworkSlug = destNetwork?.slug
        const router = routers[destNetworkSlug]
        const bridge = contracts?.networks[sourceSlug].l2Bridge

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
            addresses.networks[destNetworkSlug].l2Bridge,
            addresses.networks[destNetworkSlug].l2CanonicalToken
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
            networkName: sourceNetwork?.slug
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
        selectedToken,
        selectedNetwork,
        setSelectedNetwork,
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
