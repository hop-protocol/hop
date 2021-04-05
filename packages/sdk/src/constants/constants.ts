import { BigNumber } from 'ethers'

export enum EthereumChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GORLI = 5,
  KOVAN = 42
}

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GORLI = 5,
  KOVAN = 42,
  OPTIMISM_TESTNET = 69,
  ARBITRUM_TESTNET = 79377087078960,
  //MATIC = ?,
  XDAI_SOKOL = 77
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const MaxUint256 = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
)
