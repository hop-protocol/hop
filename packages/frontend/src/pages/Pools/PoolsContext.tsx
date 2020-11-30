import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { Contract } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import uniswapArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import uniswapV2PairArtifact from './abis/UniswapV2Pair.json'
import useNetworks from 'src/contexts/AppContext/useNetworks'
import useTokens from 'src/contexts/AppContext/useTokens'
import useContracts from 'src/contexts/AppContext/useContracts'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import Address from 'src/models/Address'
import { addresses } from 'src/config'

type PoolsContextProps = {
  networks: Network[]
  tokens: Token[]
  hToken: Token | undefined
  address: Address | undefined
  totalSupply: string | undefined
  poolTokenBalance: string | undefined
  poolReserves: string[]
  addLiquidity: (input: any) => void
}

const PoolsContext = createContext<PoolsContextProps>({
  networks: [],
  tokens: [],
  hToken: undefined,
  address: undefined,
  totalSupply: undefined,
  poolTokenBalance: undefined,
  poolReserves: [],
  addLiquidity: (input: any) => {}
})

const PoolsContextProvider: FC = ({ children }) => {
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [poolTokenBalance, setPoolTokenBalance] = useState<string>('')
  const [poolReserves, setPoolReserves] = useState<string[]>([])
  const { address, provider } = useWeb3Context()
  const { arbitrum_uniswap } = useContracts([])
  let networks = useNetworks()
  let tokens = useTokens(networks)
  const hToken = tokens.find((token: Token) => token.symbol === 'hDAI')

  // TODO: add L1 flag to model
  networks = networks.filter((network: Network) =>
    ['arbitrum', 'optimism'].includes(network.slug)
  )
  tokens = tokens.filter((token: Token) => ['DAI'].includes(token.symbol))

  const approveTokens = async (
    token: Token,
    amount: string,
    network: Network
  ) => {
    //const contract = token.contractForNetwork(network)
    const signer = (provider as any).getSigner()
    const tokenAddress = token.addressForNetwork(network).toString()
    const contract = new Contract(tokenAddress, erc20Artifact.abi, signer)

    const address = (arbitrum_uniswap as any).address
    const parsedAmount = parseUnits(amount, token.decimals)
    const approved = await contract.allowance(
      await signer.getAddress(),
      address
    )

    if (approved.lt(parsedAmount)) {
      const tx = await contract.approve(address, parsedAmount)
      await tx.wait()
      return tx.hash
    }
  }

  const addLiquidity = async (input: any) => {
    const { network } = input
    for (const { token, amount } of input.tokens) {
      await approveTokens(token, amount, network)
    }

    const address = (arbitrum_uniswap as any).address
    const signer = (provider as any).getSigner()
    const contract = new Contract(address, uniswapArtifact.abi, signer)

    const { tokens } = input
    const tokenA = tokens[0].token.addressForNetwork(network).toString()
    const tokenB = tokens[1].token.addressForNetwork(network).toString()
    const amountADesired = parseUnits(tokens[0].amount, tokens[0].decimals)
    const amountBDesired = parseUnits(tokens[1].amount, tokens[1].decimals)
    const amountAMin = 0
    const amountBMin = 0
    const to = await signer.getAddress()
    const deadline = (Date.now() / 1000 + 300) | 0

    const tx = await contract.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline
    )

    console.log('TX', tx.hash)
  }

  useEffect(() => {
    const fn = async () => {
      try {
        if (!provider) return
        const factory = new Contract(
          addresses.arbitrumUniswapFactory,
          uniswapFactoryArtifact.abi,
          provider
        )

        // TODO: dynamic address
        const pairAddress = await factory.getPair(
          addresses.arbitrumDai,
          addresses.arbitrumBridge
        )
        const pair = new Contract(
          pairAddress,
          uniswapV2PairArtifact.abi,
          provider
        )

        const decimals = await pair.decimals()
        const totalSupply = await pair.totalSupply()
        setTotalSupply(formatUnits(totalSupply.toString(), decimals))

        const signer = (provider as any).getSigner()
        const address = await signer.getAddress()
        const balance = await pair.balanceOf(address)
        const formattedBalance = formatUnits(balance.toString(), decimals)
        setPoolTokenBalance(formattedBalance)

        const reserves = await pair.getReserves()
        const reserve0 = formatUnits(reserves[0].toString(), decimals)
        const reserve1 = formatUnits(reserves[1].toString(), decimals)
        setPoolReserves([reserve0, reserve1])
      } catch (err) {
        console.error(err)
      }
    }

    fn()
  }, [provider])

  return (
    <PoolsContext.Provider
      value={{
        networks,
        tokens,
        hToken,
        address,
        totalSupply,
        poolTokenBalance,
        poolReserves,
        addLiquidity
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePools = () => useContext(PoolsContext)

export default PoolsContextProvider
