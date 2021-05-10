import React, { FC, createContext, useContext, useState, useMemo } from 'react'
import { Signer } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { UINT256, ZERO_ADDRESS } from 'src/constants'
import logger from 'src/logger'

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
  const { provider, checkConnectedNetworkId } = useWeb3Context()
  const app = useApp()
  const { networks: nets, tokens, txConfirm, sdk } = app
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
        name: 'Canonical Bridge',
        slug: network.slug,
        imageUrl: network.imageUrl,
        rpcUrl: network.rpcUrl,
        networkId: network.networkId
      })
    })
    const l2HopBridges = l2Networks.map((network: Network) => {
      return new Network({
        name: 'Hop Bridge',
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
      if (networkPairMap[sourceNetwork?.slug] === destNetwork?.slug) {
        const amount = parseUnits(value, selectedToken.decimals)
        const bridge = sdk.bridge(selectedToken?.symbol)
        const amountOut = await bridge.getAmountOut(
          amount,
          canonicalSlug(sourceNetwork),
          canonicalSlug(destNetwork)
        )

        value = Number(
          formatUnits(amountOut.toString(), selectedToken.decimals)
        ).toFixed(2)
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
        const bridge = sdk.bridge(token.symbol).connect(signer as Signer)

        const parsedAmount = parseUnits(amount, token.decimals)
        const approved = await bridge.token.allowance(
          network.slug,
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
              return bridge.token.approve(
                network.slug,
                targetAddress,
                approveAmount
              )
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
      const recipient = await signer?.getAddress()
      const value = parseUnits(
        sourceTokenAmount,
        selectedToken.decimals
      ).toString()
      let tx: any
      const sourceSlug = canonicalSlug(sourceNetwork)
      const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as Signer)
      const l1Bridge = await bridge.getL1Bridge()

      // source network is L1 ( L1 -> L2 )
      if (sourceNetwork?.isLayer1) {
        // destination network is L2 hop bridge ( L1 -> L2 Hop )
        if (destNetwork && isHopBridge(destNetwork?.slug)) {
          const bridge = sdk
            .bridge(selectedToken.symbol)
            .connect(signer as Signer)
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            l1Bridge.address
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
              const amountOutMin = 0
              const deadline = 0
              const relayer = ZERO_ADDRESS
              const relayerFee = 0

              return bridge.send(
                value,
                sourceNetwork.slug,
                canonicalSlug(destNetwork),
                {
                  recipient,
                  amountOutMin,
                  deadline,
                  relayer,
                  relayerFee
                }
              )
            }
          })

          // destination network is canonical bridge (L1 canonical -> L2 canonical)
        } else if (destNetwork && !isHopBridge(destNetwork?.slug)) {
          const destSlug = destNetwork?.slug
          const bridge = sdk
            .canonicalBridge(selectedToken.symbol, destSlug)
            .connect(signer as Signer)
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            bridge.address
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
              return bridge.connect(signer as Signer).deposit(value)
            }
          })
        }

        // source network is L2 canonical bridge ( L2 canonical -> L1 or L2 )
      } else if (
        sourceNetwork &&
        !sourceNetwork?.isLayer1 &&
        !isHopBridge(sourceNetwork?.slug)
      ) {
        // destination network is L1 ( L2 canonical -> L1 canonical)
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
              const bridge = sdk.canonicalBridge(
                selectedToken.symbol,
                sourceSlug
              )
              return bridge.connect(signer as Signer).withdraw(value)
            }
          })

          // destination network is L2 hop bridge (L2 canonical -> L2 Hop)
        } else if (isHopBridge(destNetwork?.slug)) {
          const bridge = await sdk
            .bridge(selectedToken.symbol)
            .connect(signer as Signer)
          const saddleSwap = await bridge.getSaddleSwap(
            canonicalSlug(sourceNetwork)
          )
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            saddleSwap.address as string
          )

          const amountOutMin = '0'
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
              return bridge.execSaddleSwap(
                canonicalSlug(sourceNetwork),
                false,
                value,
                amountOutMin,
                deadline
              )
            }
          })
        }

        // source network is L2 hop bridge ( L2 Hop -> L1 or L2 )
      } else if (isHopBridge(sourceNetwork?.slug) && destNetwork) {
        const bridge = await sdk
          .bridge(selectedToken.symbol)
          .connect(signer as Signer)
        const saddleSwap = await bridge.getSaddleSwap(
          canonicalSlug(sourceNetwork)
        )

        const l2Bridge = await bridge.getL2Bridge(sourceSlug)
        await approveTokens(
          selectedToken,
          sourceTokenAmount,
          sourceNetwork as Network,
          l2Bridge.address
        )

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
              const deadline = (Date.now() / 1000 + 300) | 0
              const amountOutMin = '0'
              const bonderFee = await bridge.getBonderFee(
                value,
                canonicalSlug(sourceNetwork),
                destNetwork.slug
              )

              if (bonderFee.gt(value)) {
                throw new Error('Amount must be greater than bonder fee')
              }

              return bridge.send(
                value,
                canonicalSlug(sourceNetwork),
                destNetwork.slug,
                {
                  recipient,
                  bonderFee,
                  amountOutMin,
                  deadline
                }
              )
            }
          })

          // destination network is L2 Amm ( L1 -> L2 Amm)
        } else {
          await approveTokens(
            selectedToken,
            sourceTokenAmount,
            sourceNetwork as Network,
            saddleSwap?.address as string
          )

          const amountOutMin = '0'
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
              return bridge.execSaddleSwap(
                canonicalSlug(sourceNetwork),
                true,
                value,
                amountOutMin,
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
  const withinMax = true
  let sendButtonText = 'Convert'
  const validFormFields = !!(
    sourceTokenAmount &&
    destTokenAmount &&
    enoughBalance &&
    withinMax
  )
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
