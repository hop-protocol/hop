import React, { FC, createContext, useContext, useState, useEffect, useCallback } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { useInterval } from 'react-use'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { constants } from 'ethers'
import { l1Network } from 'src/config/networks'

type VoteContextProps = {
  balance: string
  delegate: string
  humanReadableDelegate: string
}

const initialState: VoteContextProps = {
  balance: '0.00',
  delegate: constants.AddressZero,
  humanReadableDelegate: '',
}

export const VoteContext = createContext<VoteContextProps>(initialState)

export const useVoteContext = () => useContext(VoteContext)

export const VoteContextProvider: FC<{}> = ({ children }) => {
  const { address } = useWeb3Context()
  const { user, tokens, contracts, networks } = useApp()
  const l1Hop = contracts?.governance.l1Hop
  const l1HopToken = tokens[1]

  const [balance, setBalance] = useState('0.00')
  const [delegate, setDelegate] = useState(constants.AddressZero)
  const [humanReadableDelegate, setHumanReadableDelegate] = useState('')

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (user && l1HopToken) {
        const _balance = await user.getBalance(l1HopToken, l1Network)
        setBalance(Number(formatUnits(_balance.toString(), l1HopToken.decimals)).toFixed(2))
      }
    }

    _getBalance()
  }, [user, l1HopToken, l1Hop])

  const getDelegate = useCallback(() => {
    const _getDelegate = async () => {
      if (user && l1HopToken) {
        const _delegate = await l1Hop?.delegates(address?.toString())
        setDelegate(_delegate)
      }
    }

    _getDelegate()
  }, [user, l1HopToken])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, l1HopToken])

  useEffect(() => {
    getDelegate()
  }, [getDelegate, user, l1HopToken])

  useInterval(() => {
    getBalance()
    getDelegate()
  }, 20e3)

  useEffect(() => {
    if (delegate === address?.toString()) {
      setHumanReadableDelegate('self')
    } else {
      const _humanReadableDelegateStart = delegate.substr(0, 6)
      const _humanReadableDelegateEnd = delegate.substr(38, 4)
      setHumanReadableDelegate(_humanReadableDelegateStart + '...' + _humanReadableDelegateEnd)
    }
  }, [delegate])

  return (
    <VoteContext.Provider
      value={{
        balance,
        delegate,
        humanReadableDelegate,
      }}
    >
      {children}
    </VoteContext.Provider>
  )
}
