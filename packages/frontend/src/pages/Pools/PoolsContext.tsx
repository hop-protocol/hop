import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react'
import { ethers, Contract } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import Address from 'src/models/Address'
import Price from 'src/models/Price'
import { UINT256 } from 'src/constants'
import Transaction from 'src/models/Transaction'
import useInterval from 'src/hooks/useInterval'
import logger from 'src/logger'

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
  removeLiquidity: () => void
  userPoolBalance: string | undefined
  userPoolTokenPercentage: string | undefined
  token0Deposited: string | undefined
  token1Deposited: string | undefined
  token0Balance: number
  token1Balance: number
  setToken0Balance: (balance: number) => void
  setToken1Balance: (balance: number) => void
  txHash: string | undefined
  sending: boolean
  validFormFields: boolean
  sendButtonText: string
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
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
  removeLiquidity: () => {},
  userPoolBalance: undefined,
  userPoolTokenPercentage: undefined,
  token0Deposited: undefined,
  token1Deposited: undefined,
  token0Balance: 0,
  token1Balance: 0,
  setToken0Balance: (balance: number) => {},
  setToken1Balance: (balance: number) => {},
  txHash: undefined,
  sending: false,
  validFormFields: false,
  sendButtonText: '',
  error: null,
  setError: (error: string | null | undefined) => {}
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
  const [token0Balance, setToken0Balance] = useState<number>(0)
  const [token1Balance, setToken1Balance] = useState<number>(0)

  let { networks, tokens, contracts, txConfirm, txHistory, sdk } = useApp()
  const { address, provider, checkConnectedNetworkId } = useWeb3Context()
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [error, setError] = useState<string | null | undefined>(null)

  const hopToken = useMemo(() => {
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }
    const l2Networks = networks.filter(network => !network.isLayer1)
    const hopBridgeContracts = l2Networks.reduce((obj, network) => {
      const contract = token?.contracts[`${network.slug}HopBridge`]
      if (contract) {
        obj[network.slug] = contract
      }
      return obj
    }, {} as { [key: string]: Contract })

    return new Token({
      symbol: `h${token?.symbol}`,
      tokenName: token?.tokenName,
      imageUrl: token?.imageUrl,
      contracts: hopBridgeContracts
    })
  }, [tokens, selectedToken, networks])

  networks = networks.filter(
    (network: Network) =>
      !network.isLayer1 &&
      selectedToken.supportedNetworks.includes(network.slug)
  )
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])
  const [txHash, setTxHash] = useState<string | undefined>()
  const [sending, setSending] = useState<boolean>(false)

  useEffect(() => {
    if (!networks.includes(selectedNetwork)) {
      setSelectedNetwork(networks[0])
    }
  }, [networks])
  useEffect(() => {
    if (Number(token0Price) && Number(token0Amount) && !Number(token1Amount)) {
      const token1Value = Number(token0Amount) * Number(token1Rate)
      setToken1Amount(token1Value.toFixed(2))
    }
  }, [token0Price, token0Amount, token1Amount])
  useEffect(() => {
    if (Number(token1Price) && Number(token1Amount) && !Number(token0Amount)) {
      const token0Value = Number(token1Amount) / Number(token1Rate)
      setToken0Amount(token0Value.toFixed(2))
    }
  }, [token1Price, token0Amount, token1Amount])

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
      setPoolSharePercentage((sharePercentage || '0').toString())
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
      const contractProvider = selectedNetwork.provider
      if (!contractProvider) return
      const signer = provider?.getSigner()
      const signerAddress = await signer.getAddress()

      const bridge = await sdk.bridge(selectedToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)

      const [decimals, totalSupply, balance, reserves] = await Promise.all([
        lpToken.decimals(),
        lpToken.totalSupply(),
        lpToken.balanceOf(signerAddress),
        bridge.getSaddleSwapReserves(selectedNetwork.slug)
      ])

      const formattedTotalSupply = formatUnits(
        totalSupply.toString(),
        Number(decimals.toString())
      )
      setTotalSupply(formattedTotalSupply)

      const formattedBalance = formatUnits(balance.toString(), decimals)
      setUserPoolBalance(Number(formattedBalance).toFixed(2))

      const poolPercentage =
        (Number(formattedBalance) / Number(formattedTotalSupply)) * 100
      const formattedPoolPercentage =
        poolPercentage.toFixed(2) === '0.00'
          ? '<0.01'
          : poolPercentage.toFixed(2)
      setUserPoolTokenPercentage(formattedPoolPercentage)

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

      /*
      const amount0 = parseUnits('1', decimals)
      const amount1 = await uniswapRouter?.quote(
        amount0,
        parseUnits(reserve0, decimals),
        parseUnits(reserve1, decimals)
      )
      const formattedAmountB = formatUnits(amount1, decimals)
      setToken1Rate(formattedAmountB)
         */
      setToken1Rate('1')
    } catch (err) {
      logger.error(err)
    }
  }, [provider, selectedNetwork, selectedToken, hopToken])

  useEffect(() => {
    updateUserPoolPositions()
  }, [
    provider,
    selectedNetwork,
    selectedToken,
    hopToken,
    updateUserPoolPositions
  ])

  useInterval(() => {
    updatePrices()
  }, 5 * 1000)

  useInterval(() => {
    updateUserPoolPositions()
  }, 20 * 1000)

  const approveTokens = async (
    token: Token,
    amount: string,
    network: Network
  ): Promise<ethers.providers.TransactionResponse | undefined> => {
    const signer = provider?.getSigner()
    const tokenAddress = token.addressForNetwork(network).toString()
    const contract = contracts?.getErc20Contract(tokenAddress, signer)

    const saddleSwap = await sdk
      .bridge(selectedToken.symbol)
      .getSaddleSwap(network.slug)
    const spender = saddleSwap.address
    const parsedAmount = parseUnits(amount, token.decimals || 18)
    const approved = await contract?.allowance(
      await signer?.getAddress(),
      spender
    )

    if (approved.lt(parsedAmount)) {
      return txConfirm?.show({
        kind: 'approval',
        inputProps: {
          amount,
          token
        },
        onConfirm: async (approveAll: boolean) => {
          return contract?.approve(spender, approveAll ? UINT256 : parsedAmount)
        }
      })
    }
  }

  const addLiquidity = async () => {
    try {
      setError(null)
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      if (!Number(token0Amount)) {
        return
      }
      if (!Number(token1Amount)) {
        return
      }

      setSending(true)
      let tx = await approveTokens(selectedToken, token0Amount, selectedNetwork)
      if (tx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      await tx?.wait()
      setTxHash(tx?.hash)
      tx = await approveTokens(hopToken as Token, token1Amount, selectedNetwork)
      if (tx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      setTxHash(tx?.hash)
      await tx?.wait()

      const signer = provider?.getSigner()
      const amount0Desired = parseUnits(
        token0Amount,
        selectedToken?.decimals || 18
      )
      const amount1Desired = parseUnits(token1Amount, hopToken?.decimals || 18)
      const minToMint = 0
      const deadline = (Date.now() / 1000 + 5 * 60) | 0

      tx = await txConfirm?.show({
        kind: 'addLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount,
            token: selectedToken,
            network: selectedNetwork
          },
          token1: {
            amount: token1Amount,
            token: hopToken,
            network: selectedNetwork
          }
        },
        onConfirm: async () => {
          const bridge = sdk.bridge(selectedToken.symbol)
          return bridge
            .connect(signer as any)
            .addLiquidity(
              amount0Desired as any,
              amount1Desired as any,
              selectedNetwork.slug,
              {
                minToMint,
                deadline
              }
            )
        }
      })

      setTxHash(tx?.hash)
      if (tx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      await tx?.wait()
      updateUserPoolPositions()
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  const removeLiquidity = async () => {
    try {
      setError(null)
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      const saddleSwap = await sdk
        .bridge(selectedToken.symbol)
        .getSaddleSwap(selectedNetwork.slug)
      const lpToken = await sdk
        .bridge(selectedToken.symbol)
        .getSaddleLpToken(selectedNetwork.slug)

      const signer = provider?.getSigner()
      const to = await signer?.getAddress()
      const balance = await lpToken?.balanceOf(to)
      const formattedBalance = Number(formatUnits(balance.toString(), 18))
      let liquidityTokensAmount = 0

      let tx: any
      const approved = await lpToken?.allowance(
        await signer?.getAddress(),
        saddleSwap.address
      )

      if (approved.lt(balance)) {
        tx = await txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: formattedBalance,
            token: new Token({
              symbol: await lpToken.symbol(),
              tokenName: await lpToken.name(),
              imageUrl: '',
              contracts: {}
            })
          },
          onConfirm: async (approveAll: boolean) => {
            return lpToken.approve(
              saddleSwap.address,
              approveAll ? UINT256 : balance
            )
          }
        })
      }

      if (tx?.hash) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      setTxHash(tx?.hash)
      await tx?.wait()

      //setSending(true)
      const amount0Min = '0'
      const amount1Min = '0'
      const deadline = (Date.now() / 1000 + 5 * 60) | 0

      let token0Amount = token0Deposited
      let token1Amount = token1Deposited

      tx = await txConfirm?.show({
        kind: 'removeLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount,
            token: selectedToken,
            network: selectedNetwork
          },
          token1: {
            amount: token1Amount,
            token: hopToken,
            network: selectedNetwork
          }
        },
        onConfirm: async (amountPercent: number) => {
          liquidityTokensAmount = formattedBalance * (amountPercent / 100)
          const parsedLiquidityTokenAmount = parseUnits(
            liquidityTokensAmount.toString(),
            18
          )

          const bridge = sdk.bridge(selectedToken.symbol)
          return bridge
            .connect(signer as any)
            .removeLiquidity(
              parsedLiquidityTokenAmount as any,
              selectedNetwork.slug,
              {
                amount0Min,
                amount1Min,
                deadline
              }
            )
        }
      })

      setTxHash(tx?.hash)
      if (tx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      await tx?.wait()
      updateUserPoolPositions()
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  const enoughBalance =
    token0Balance >= Number(token0Amount) &&
    token1Balance >= Number(token1Amount)
  const validFormFields = !!(token0Amount && token1Amount && enoughBalance)
  let sendButtonText = 'Add Liquidity'
  if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
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
        removeLiquidity,
        userPoolBalance,
        userPoolTokenPercentage,
        token0Deposited,
        token1Deposited,
        txHash,
        sending,
        validFormFields,
        token0Balance,
        token1Balance,
        setToken0Balance,
        setToken1Balance,
        sendButtonText,
        error,
        setError
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePools = () => useContext(PoolsContext)

export default PoolsContextProvider
