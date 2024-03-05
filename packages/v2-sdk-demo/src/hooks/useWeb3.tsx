import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { providers } from 'ethers'
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule()
// const gnosis = gnosisModule()

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213'
  },
  {
    id: '0x5',
    token: 'ETH',
    label: 'Goerli',
    rpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213'
  },
  {
    id: '0xA',
    token: 'ETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io'
  },
  {
    id: '0x1A4',
    token: 'ETH',
    label: 'Optimism Goerli',
    rpcUrl: 'https://goerli.optimism.io'
  },
  {
    id: '0x14A33',
    token: 'ETH',
    label: 'Base Goerli',
    rpcUrl: 'https://goerli.base.org'
  }
]

export function useWeb3 () {
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>()
  const [address, setAddress] = useState('')
  const [connectedNetworkId, setConnectedNetworkId] = useState<number|undefined>()
  const [walletName, setWalletName] = useState<string>('')
  const [walletIcon, setWalletIcon] = useState<string>('')
  const [error, setError] = useState('')

  const onboard = useMemo(() => {
    const instance = Onboard({
      appMetadata: {
        name: 'Hop',
        icon: 'https://assets.hop.exchange/logos/hop.svg',
        description: 'Hop Protocol',
      },
      wallets: [injected],
      chains,
      connect: {
        showSidebar: false,
        disableClose: false,
        autoConnectLastWallet: true,
        autoConnectAllPreviousWallet: false,
      },
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        }
      },
      notify: {
        enabled: false
      },
    })

    return instance
  }, [])

  async function handleWalletChange(wallet: any) {
    try {
      const _address = wallet?.accounts?.[0]?.address
      if (_address) {
        setAddress(_address)
      } else {
        setAddress('')
      }

      const connectedNetworkId = Number(wallet?.chains?.[0]?.id)
      if (connectedNetworkId) {
        setConnectedNetworkId(connectedNetworkId)
      } else {
        setConnectedNetworkId(undefined)
      }

      if (wallet?.provider) {
        const { icon, label, provider } = wallet
        const ethersProvider = new providers.Web3Provider(provider, 'any')
        if (provider.enable && !provider.isMetaMask) {
          // needed for WalletConnect and some wallets
          await provider.enable()
        } else {
          // note: this method may not be supported by all wallets
          try {
            await ethersProvider.send('eth_requestAccounts', [])
          } catch (error) {
            console.error(error)
          }
        }
        setProvider(ethersProvider)
        setWalletName(label)

        try {
          const svg = new Blob([icon], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(svg)
          setWalletIcon(url)
        } catch (err: any) {
          setWalletIcon('')
        }

        return ethersProvider
      } else {
        setWalletName('')
        setWalletIcon('')
        setProvider(undefined)
        setAddress('')
      }
    } catch (err) {
      console.error(err)
      setProvider(undefined)
      setAddress('')
    }
  }

  useEffect(() => {
    const state = onboard.state.select('wallets')
    let lastUpdate = ''
    const { unsubscribe } = state.subscribe((update) => {
      let shouldUpdate = true
      const _walletName = update?.[0]?.label
      if (_walletName === 'WalletConnect') {
        const str = JSON.stringify({ account: update?.[0]?.accounts, chains: update?.[0]?.chains })
        shouldUpdate = lastUpdate !== str
        if (shouldUpdate) {
          lastUpdate = str
        }
      }
      if (shouldUpdate) {
        // logger.debug('onboard state update: ', update)
        const [wallet] = update
        handleWalletChange(wallet)
      }
    })

    return () => {
      try {
        unsubscribe()
      } catch (err: any) {}
    }
  }, [onboard])

  async function requestWallet() {
    try {
      localStorage.clear()
      const [primaryWallet] = onboard.state.get().wallets
      if (primaryWallet) {
        await onboard.disconnectWallet({ label: primaryWallet.label })
      }
      await onboard.connectWallet()
      const _wallet = onboard.state.get().wallets?.[0]
      if (_wallet) {
        const provider = handleWalletChange(_wallet)
        return provider
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function disconnectWallet() {
    try {
      localStorage.clear()
      const [primaryWallet] = onboard.state.get().wallets
      if (primaryWallet) {
        await onboard.disconnectWallet({ label: primaryWallet.label })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const checkConnectedNetworkId = async (networkId?: number): Promise<boolean> => {
    if (!(networkId && provider)) return false

    const signerNetworkId = (await provider.getNetwork())?.chainId
    console.debug('checkConnectedNetworkId', networkId, signerNetworkId)

    try {
      // NOTE: some mobile wallets don't support wallet_switchEthereumChain or wallet_addEthereumChain.
      // NOTE: Trust Wallet hangs indefinteily on wallet_switchEthereumChain, see issues on discord.
      // Therefore if provider is already connected to correct network,
      // then there's no need to attempt to call network switcher.
      if (signerNetworkId === networkId) {
        return true
      }

      const wallets = onboard.state.get().wallets
      console.debug('onboard wallets', wallets)
      const _address = wallets?.[0].accounts?.[0]?.address
      if (_address) {
        await onboard.setChain({ chainId: networkId })
      }
    } catch (err: any) {
      console.error('checkConnectedNetworkId error:', err)
    }

    // after network switch, recheck if provider is connected to correct network.
    const net = await provider.getNetwork()
    if (net.chainId === networkId) {
      return true
    }

    return false
  }

  async function checkConnectedNetworkIdOrThrow (chainId: number) {
    const isConnected = await checkConnectedNetworkId(chainId)
    if (!isConnected) {
      throw new Error(`Please connect your wallet to the ${chainId} network`)
    }
  }

  const walletConnected = !!address

  async function getSignerOrRequestWallet() {
    let signer = provider?.getSigner()
    if (!signer) {
      const _provider = await requestWallet()
      signer = _provider?.getSigner()
    }
    if (!signer) {
      throw new Error('No signer')
    }

    return signer
  }

  return {
    onboard,
    provider,
    address,
    error,
    requestWallet,
    disconnectWallet,
    walletConnected,
    getSignerOrRequestWallet,
    checkConnectedNetworkId,
    checkConnectedNetworkIdOrThrow,
    connectedNetworkId
  }
}
