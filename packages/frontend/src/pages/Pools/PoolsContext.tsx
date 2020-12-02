import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'
import { Contract } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import uniswapV2PairArtifact from 'src/pages/Pools/abis/UniswapV2Pair.json'
import useNetworks from 'src/contexts/AppContext/useNetworks'
import useTokens from 'src/contexts/AppContext/useTokens'
import useContracts from 'src/contexts/AppContext/useContracts'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import Address from 'src/models/Address'
import Price from 'src/models/Price'
import { addresses } from 'src/config'
import useInterval from 'src/hooks/useInterval'

type PoolsContextProps = {
  networks: Network[]
  tokens: Token[]
  hopToken: Token | undefined
  address: Address | undefined
  totalSupply: string | undefined
  selectedToken: Token | undefined
  setSelectedToken: (token: Token) => void
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network) => void
  token0Amount: string
  setToken0Amount: (value: string) => void
  token1Amount: string
  setToken1Amount: (value: string) => void
  poolSharePercentage: string | undefined
  token0Price: string | undefined
  token1Price: string | undefined
  poolReserves: string[]
  token1Rate: string | undefined
  addLiquidity: () => void
  userPoolBalance: string | undefined
  userPoolTokenPercentage: string | undefined
  token0Deposited: string | undefined
  token1Deposited: string | undefined
  txHash: string | undefined
}

const PoolsContext = createContext<PoolsContextProps>({
  networks: [],
  tokens: [],
  hopToken: undefined,
  address: undefined,
  totalSupply: undefined,
  selectedToken: undefined,
  setSelectedToken: (token: Token) => {},
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network) => {},
  token0Amount: '',
  setToken0Amount: (value: string) => {},
  token1Amount: '',
  setToken1Amount: (value: string) => {},
  poolSharePercentage: undefined,
  token0Price: undefined,
  token1Price: undefined,
  poolReserves: [],
  token1Rate: undefined,
  addLiquidity: () => {},
  userPoolBalance: undefined,
  userPoolTokenPercentage: undefined,
  token0Deposited: undefined,
  token1Deposited: undefined,
  txHash: undefined
})

const PoolsContextProvider: FC = ({ children }) => {
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [token1Amount, setToken1Amount] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [token1Rate, setToken1Rate] = useState<string>('')
  const [poolReserves, setPoolReserves] = useState<string[]>([])
  const [poolSharePercentage, setPoolSharePercentage] = useState<string>('0')
  const [token0Price, setToken0Price] = useState<string>('-')
  const [token1Price, setToken1Price] = useState<string>('-')
  const [userPoolBalance, setUserPoolBalance] = useState<string>('')
  const [userPoolTokenPercentage, setUserPoolTokenPercentage] = useState<
    string
  >('')
  const [token0Deposited, setToken0Deposited] = useState<string>('')
  const [token1Deposited, setToken1Deposited] = useState<string>('')
  const { address, provider } = useWeb3Context()
  const { arbitrum_uniswap } = useContracts([])
  let networks = useNetworks()
  let tokens = useTokens(networks)
  const hopToken = tokens.find((token: Token) => token.symbol === 'hDAI')
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  networks = networks.filter((network: Network) => !network.isLayer1)
  tokens = tokens.filter((token: Token) => ['DAI'].includes(token.symbol))
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])
  const [txHash, setTxHash] = useState<string | undefined>()

  const updatePrices = useCallback(async () => {
    if (!totalSupply) return
    if (token1Rate) {
      const price = new Price(token1Rate, '1')
      setToken0Price(price.toFixed(2))
      setToken1Price(price.inverted().toFixed(2))
    }

    if (token0Amount && token1Amount) {
      const amount0 =
        (Number(token0Amount) * Number(totalSupply)) / Number(poolReserves[0])
      const amount1 =
        (Number(token1Amount) * Number(totalSupply)) / Number(poolReserves[1])
      const liquidity = Math.min(amount0, amount1)
      const sharePercentage = Math.max(
        Math.min(
          Number(
            ((liquidity / (Number(totalSupply) + liquidity)) * 100).toFixed(2)
          ),
          100
        ),
        0
      )
      setPoolSharePercentage(sharePercentage.toString())
    } else {
      setPoolSharePercentage('0')
    }
  }, [token0Amount, totalSupply, token1Amount, token1Rate, poolReserves])

  useEffect(() => {
    updatePrices()
  }, [
    hopToken,
    token0Amount,
    totalSupply,
    token1Amount,
    token1Rate,
    poolReserves,
    updatePrices
  ])

  const updateUserPoolPositions = useCallback(async () => {
    try {
      if (!provider) return
      const factory = new Contract(
        addresses.arbitrumUniswapFactory,
        uniswapFactoryArtifact.abi,
        provider
      )
      const pairAddress = await factory.getPair(
        selectedToken?.addressForNetwork(selectedNetwork).toString(),
        hopToken?.addressForNetwork(selectedNetwork).toString()
      )
      const pair = new Contract(
        pairAddress,
        uniswapV2PairArtifact.abi,
        provider
      )

      const decimals = await pair.decimals()
      const totalSupply = await pair.totalSupply()
      const formattedTotalSupply = formatUnits(totalSupply.toString(), decimals)
      setTotalSupply(formattedTotalSupply)

      const signer = provider?.getSigner()
      const address = await signer.getAddress()
      const balance = await pair.balanceOf(address)
      const formattedBalance = formatUnits(balance.toString(), decimals)
      setUserPoolBalance(Number(formattedBalance).toFixed(2))

      const poolPercentage =
        (Number(formattedBalance) / Number(formattedTotalSupply)) * 100
      const formattedPoolPercentage =
        poolPercentage.toFixed(2) === '0.00'
          ? '<0.01'
          : poolPercentage.toFixed(2)
      setUserPoolTokenPercentage(formattedPoolPercentage)

      const reserves = await pair.getReserves()
      const reserve0 = formatUnits(reserves[0].toString(), decimals)
      const reserve1 = formatUnits(reserves[1].toString(), decimals)
      setPoolReserves([reserve0, reserve1])

      const token0Deposited =
        (Number(formattedBalance) * Number(reserve0)) /
        Number(formattedTotalSupply)
      const token1Deposited =
        (Number(formattedBalance) * Number(reserve1)) /
        Number(formattedTotalSupply)
      setToken0Deposited(token0Deposited.toFixed(2))
      setToken1Deposited(token1Deposited.toFixed(2))

      const routerAddress = arbitrum_uniswap?.address as string
      const router = new Contract(
        routerAddress,
        uniswapRouterArtifact.abi,
        signer
      )

      const amountA = parseUnits('1', decimals)

      // note: quote is `amountB = (amountA * reserveB) / reserveA`
      const amountB = await router.quote(
        amountA,
        parseUnits(reserve0, decimals),
        parseUnits(reserve1, decimals)
      )
      const formattedAmountB = formatUnits(amountB, decimals)
      setToken1Rate(formattedAmountB)
    } catch (err) {
      console.error(err)
    }
  }, [provider, arbitrum_uniswap, selectedNetwork, selectedToken, hopToken])

  useEffect(() => {
    updateUserPoolPositions()
  }, [
    provider,
    arbitrum_uniswap,
    selectedNetwork,
    selectedToken,
    hopToken,
    updateUserPoolPositions
  ])

  useInterval(() => {
    updatePrices()
    updateUserPoolPositions()
  }, 5 * 1000)

  const approveTokens = async (
    token: Token,
    amount: string,
    network: Network
  ) => {
    const signer = provider?.getSigner()
    const tokenAddress = token.addressForNetwork(network).toString()
    const contract = new Contract(tokenAddress, erc20Artifact.abi, signer)

    const address = arbitrum_uniswap?.address
    const parsedAmount = parseUnits(amount, token.decimals)
    const approved = await contract.allowance(
      await signer?.getAddress(),
      address
    )

    if (approved.lt(parsedAmount)) {
      const tx = await contract.approve(address, parsedAmount)
      return tx
    }
  }

  const addLiquidity = async () => {
    let tx = await approveTokens(selectedToken, token0Amount, selectedNetwork)
    await tx?.wait()
    setTxHash(tx?.hash)
    tx = await approveTokens(hopToken as Token, token1Amount, selectedNetwork)
    setTxHash(tx?.hash)
    await tx?.wait()

    const address = arbitrum_uniswap?.address as string
    const signer = provider?.getSigner()
    const router = new Contract(address, uniswapRouterArtifact.abi, signer)

    const tokenA = selectedToken?.addressForNetwork(selectedNetwork).toString()
    const tokenB = hopToken?.addressForNetwork(selectedNetwork).toString()
    const amountADesired = parseUnits(
      token0Amount,
      selectedToken?.decimals || 18
    )
    const amountBDesired = parseUnits(token1Amount, hopToken?.decimals || 18)
    const amountAMin = 0
    const amountBMin = 0
    const to = await signer?.getAddress()
    const deadline = (Date.now() / 1000 + 5 * 60) | 0

    tx = await router.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline
    )

    setTxHash(tx.hash)
    await tx.wait()
  }

  return (
    <PoolsContext.Provider
      value={{
        networks,
        tokens,
        hopToken,
        address,
        totalSupply,
        selectedToken,
        setSelectedToken,
        selectedNetwork,
        setSelectedNetwork,
        token0Amount,
        setToken0Amount,
        token1Amount,
        setToken1Amount,
        poolSharePercentage,
        token0Price,
        token1Price,
        poolReserves,
        token1Rate,
        addLiquidity,
        userPoolBalance,
        userPoolTokenPercentage,
        token0Deposited,
        token1Deposited,
        txHash
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePools = () => useContext(PoolsContext)

export default PoolsContextProvider
