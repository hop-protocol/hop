import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import { Contract } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import L1ArbitrumMessengerArtifact from '@hop-exchange/contracts/artifacts/contracts/test/arbitrum/inbox/GlobalInbox.sol/GlobalInbox.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import ArbERC20 from 'src/pages/Convert/abis/ArbERC20.json'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import useContracts from 'src/contexts/AppContext/useContracts'
import { addresses } from 'src/config'

type ConvertContextProps = {
  selectedToken: Token | undefined
  sourceNetwork: Network | undefined
  setSourceNetwork: (network: Network) => void
  sourceNetworks: Network[]
  destNetwork: Network | undefined
  setDestNetwork: (network: Network) => void
  destNetworks: Network[]
  token0Amount: string | undefined
  setToken0Amount: (value: string) => void
  token1Amount: string | undefined
  setToken1Amount: (value: string) => void
  convertTokens: () => void
}

const ConvertContext = createContext<ConvertContextProps>({
  selectedToken: undefined,
  sourceNetwork: undefined,
  setSourceNetwork: (network: Network) => {},
  sourceNetworks: [],
  destNetwork: undefined,
  setDestNetwork: (network: Network) => {},
  destNetworks: [],
  token0Amount: undefined,
  setToken0Amount: (value: string) => {},
  token1Amount: undefined,
  setToken1Amount: (value: string) => {},
  convertTokens: () => {}
})

const ConvertContextProvider: FC = ({ children }) => {
  const { provider } = useWeb3Context()
  let { networks: nets, tokens } = useApp()
  const networks = useMemo(() => {
    const kovanNetwork = nets.find(
      (network: Network) => network.slug === 'kovan'
    ) as Network
    const arbitrumNetwork = nets.find(
      (network: Network) => network.slug === 'arbitrum'
    ) as Network
    const arbitrumCanonicalBridgeNetwork = new Network({
      name: 'Arbitrum Canonical',
      slug: arbitrumNetwork.slug,
      imageUrl: arbitrumNetwork.imageUrl,
      rpcUrl: arbitrumNetwork.rpcUrl
    })
    const arbitrumHopBridgeNetwork = new Network({
      name: 'Arbitrum Hop bridge',
      slug: 'arbitrum_hop_bridge',
      imageUrl: arbitrumNetwork.imageUrl,
      rpcUrl: arbitrumNetwork.rpcUrl
    })
    return [
      kovanNetwork,
      arbitrumCanonicalBridgeNetwork,
      arbitrumHopBridgeNetwork
    ]
  }, [nets])
  const [sourceNetworks] = useState<Network[]>(networks)
  const [destNetworks, setDestNetworks] = useState<Network[]>([])
  tokens = tokens.filter((token: Token) => ['DAI'].includes(token.symbol))
  const [selectedToken] = useState<Token>(tokens[0])
  const [sourceNetwork, setSourceNetwork] = useState<Network | undefined>(
    sourceNetworks[0]
  )
  const [destNetwork, setDestNetwork] = useState<Network | undefined>(
    destNetworks[0]
  )
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [token1Amount, setToken1Amount] = useState<string>('')
  const { arbitrum_uniswap } = useContracts([])

  useEffect(() => {
    if (sourceNetwork?.slug === 'kovan') {
      const destNetworks = networks.filter((network: Network) =>
        ['arbitrum'].includes(network.slug)
      )
      setDestNetworks(destNetworks)
      setDestNetwork(destNetworks[0])
    } else if (sourceNetwork?.slug === 'arbitrum') {
      const destNetworks = networks.filter((network: Network) =>
        ['arbitrum_hop_bridge', 'kovan'].includes(network.slug)
      )
      setDestNetworks(destNetworks)
      setDestNetwork(destNetworks[0])
    } else if (sourceNetwork?.slug === 'arbitrum_hop_bridge') {
      const destNetworks = networks.filter((network: Network) =>
        ['arbitrum'].includes(network.slug)
      )
      setDestNetworks(destNetworks)
      setDestNetwork(destNetworks[0])
    }
  }, [networks, sourceNetwork])

  useEffect(() => {
    const update = async () => {
      let value = token0Amount
      if (
        value &&
        ((sourceNetwork?.slug === 'arbitrum_hop_bridge' &&
          destNetwork?.slug === 'arbitrum') ||
          (sourceNetwork?.slug === 'arbitrum' &&
            destNetwork?.slug === 'arbitrum_hop_bridge'))
      ) {
        const router = new Contract(
          addresses.arbitrumUniswapRouter,
          uniswapRouterArtifact.abi,
          provider
        )

        let path = [addresses.arbitrumDai, addresses.arbitrumBridge]
        if (destNetwork?.slug === 'arbitrum') {
          path = [addresses.arbitrumBridge, addresses.arbitrumDai]
        }

        const amountsOut = await router.getAmountsOut(value, path)

        value = parseInt(amountsOut[1], 16).toFixed(2)
      }

      setToken1Amount(value)
    }

    update()
  }, [token0Amount, sourceNetwork, destNetwork, provider])

  const convertTokens = useCallback(async () => {
    if (!Number(token0Amount)) {
      return
    }

    const approveTokens = async (
      token: Token,
      amount: string,
      network: Network
    ) => {
      const signer = provider?.getSigner()
      const tokenAddress = token.addressForNetwork(network).toString()
      const contract = new Contract(tokenAddress, erc20Artifact.abi, signer)

      const address = arbitrum_uniswap?.address
      const parsedAmount = parseUnits(amount, token.decimals || 18)
      const approved = await contract.allowance(
        await signer?.getAddress(),
        address
      )

      if (approved.lt(parsedAmount)) {
        const tx = await contract.approve(address, parsedAmount)
        return tx
      }
    }

    const signer = provider?.getSigner()
    const address = await signer?.getAddress()
    const value = parseUnits(token0Amount, 18)

    let tx = await approveTokens(
      selectedToken,
      token0Amount,
      sourceNetwork as Network
    )
    await tx?.wait()

    if (sourceNetwork?.slug === 'kovan') {
      if (destNetwork?.slug === 'arbitrum') {
        const tokenAddress = selectedToken
          .addressForNetwork(sourceNetwork)
          .toString()
        const arbitrumBridge = new Contract(
          addresses.l1Messenger,
          L1ArbitrumMessengerArtifact.abi,
          signer
        )

        const arbChainAddress = '0xC34Fd04E698dB75f8381BFA7298e8Ae379bFDA71'
        const tx = await arbitrumBridge.depositERC20Message(
          arbChainAddress,
          tokenAddress,
          address,
          value
        )

        console.log(tx?.hash)
      }
    } else if (sourceNetwork?.slug === 'arbitrum') {
      if (destNetwork?.slug === 'kovan') {
        const tokenAddress = selectedToken
          .addressForNetwork(sourceNetwork)
          .toString()
        const arbitrumBridge = new Contract(
          addresses.arbitrumDai,
          ArbERC20.abi,
          signer
        )

        const tx = await arbitrumBridge.withdraw(tokenAddress, value)

        console.log(tx?.hash)
      }
      if (destNetwork?.slug === 'arbitrum_hop_bridge') {
        const router = new Contract(
          addresses.arbitrumUniswapRouter,
          uniswapRouterArtifact.abi,
          signer
        )

        const amountOutMin = '0'
        const path = [addresses.arbitrumDai, addresses.arbitrumBridge]
        const deadline = (Date.now() / 1000 + 300) | 0

        const tx = await router.swapExactTokensForTokens(
          value,
          amountOutMin,
          path,
          address,
          deadline
        )

        console.log(tx?.hash)
      }
    } else if (sourceNetwork?.slug === 'arbitrum_hop_bridge') {
      if (destNetwork?.slug === 'arbitrum') {
        const router = new Contract(
          addresses.arbitrumUniswapRouter,
          uniswapRouterArtifact.abi,
          signer
        )

        const amountOutMin = '0'
        const path = [addresses.arbitrumBridge, addresses.arbitrumDai]
        const deadline = (Date.now() / 1000 + 300) | 0

        const tx = await router.swapExactTokensForTokens(
          value,
          amountOutMin,
          path,
          address,
          deadline
        )

        console.log(tx?.hash)
      }
    }
  }, [
    provider,
    selectedToken,
    destNetwork,
    sourceNetwork,
    token0Amount,
    arbitrum_uniswap
  ])

  return (
    <ConvertContext.Provider
      value={{
        selectedToken,
        sourceNetwork,
        setSourceNetwork,
        sourceNetworks,
        destNetwork,
        setDestNetwork,
        destNetworks,
        token0Amount,
        setToken0Amount,
        token1Amount,
        setToken1Amount,
        convertTokens
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
