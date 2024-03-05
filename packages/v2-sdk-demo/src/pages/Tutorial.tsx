import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import { HighlightedButton } from '../components/HighlightedButton'
import { CustomTextField } from '../components/CustomTextField'
import { SiteWrapper } from '../components/SiteWrapper'
import { providers, Contract, ContractFactory } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useWeb3 } from '../hooks/useWeb3'
import bidirectionalGreeterArtifact from '../abi/BidirectionalGreeter.json'
import Alert from '@mui/material/Alert'
import { Syntax } from '../components/Syntax'
import Typography from '@mui/material/Typography'
import { CustomPaper } from '../components/CustomPaper'
import { useQuery } from 'react-query'
import { Hop } from '@hop-protocol/v2-sdk'
import '../tutorial.css'

export function Tutorial () {
  const { address, getSignerOrRequestWallet, requestWallet, disconnectWallet, checkConnectedNetworkIdOrThrow } = useWeb3()
  const [error, setError] = useState('')
  const [isDeployingGreeterOnGoerli, setIsDeployingGreeterOnGoerli] = useState(false)
  const [isDeployingGreeterOnOptimism, setIsDeployingGreeterOnOptimism] = useState(false)
  const [isConnectingTargets, setIsConnectingTargets] = useState(false)
  const [isSettingConnectorOnGoerli, setIsSettingConnectorOnGoerli] = useState(false)
  const [isSettingConnectorOnOptimism, setIsSettingConnectorOnOptimism] = useState(false)
  const [isSendingGreetingOnGoerli, setIsSendingGreetingOnGoerli] = useState(false)
  const [isSendingGreetingOnOptimism, setIsSendingGreetingOnOptimism] = useState(false)
  const [greetingMessageFromGoerli, setGreetingMessageFromGoerli] = useState('Hello from Goerli!')
  const [greetingMessageFromOptimism, setGreetingMessageFromOptimism] = useState('Hello from Optimism!')
  const [isSendingMessageRelayOnGoerli, setIsSendingMessageRelayOnGoerli] = useState(false)
  const hubConnectorFactoryOnGoerliAddress = '0x3Ee9619e948c8E50eDBD6b123e1c24B278556b4a'
  const messageFee = '1000000000000'

  const rpcUrls: any = {
    goerli: 'https://rpc.ankr.com/eth_goerli',
    optimism: 'https://rpc.ankr.com/optimism_testnet',
  }

  const { data: goerliBalance } = useQuery(
    [
      `goerliBalance:${address}`,
      address
    ],
    async () => {
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.goerli)
      const balance = await provider.getBalance(address)
      const formattedBalance = formatEther(balance.toString())
      return {
        balance,
        formattedBalance
      }
    },
    {
      enabled: !!address,
      refetchInterval: 60 * 1000
    }
  )

  const { data: optimismBalance } = useQuery(
    [
      `optimismBalance:${address}`,
      address
    ],
    async () => {
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.optimism)
      const balance = await provider.getBalance(address)
      const formattedBalance = formatEther(balance.toString())
      return {
        balance,
        formattedBalance
      }
    },
    {
      enabled: !!address,
      refetchInterval: 60 * 1000
    }
  )

  const [greeterAddressOnGoerli, setGreeterAddressOnGoerli] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:greeterAddressOnGoerli')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [greeterAddressOnOptimism, setGreeterAddressOnOptimism] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:greeterAddressOnOptimism')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [connectorAddress, setConnectorAddress] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:connector')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [connectorTxOnGoerli, setConnectorTxOnGoerli] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:connectorTxOnGoerli')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [connectorTxOnOptimism, setConnectorTxOnOptimism] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:connectorTxOnOptimism')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [greetingTxOnGoerli, setGreetingTxOnGoerli] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:greetingTxOnGoerli')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [greetingTxOnOptimism, setGreetingTxOnOptimism] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:greetingTxOnOptimism')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [messageRelayTxOnGoerli, setMessageRelayTxOnGoerli] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:messageRelayTxOnGoerli')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const { data: isL2TxHashExited } = useQuery(
    [
      `isl2TxHashExited:${greetingTxOnOptimism}`,
      greetingTxOnOptimism
    ],
    async () => {
      if (!greetingTxOnOptimism) {
        return false
      }
      const sdk = new Hop('goerli')
      const isExited = await sdk.getIsL2TxHashExited({
        transactionHash: greetingTxOnOptimism,
        fromChainId: 420
      })
      return isExited
    },
    {
      enabled: !!greetingTxOnOptimism,
      refetchInterval: 10 * 1000
    }
  )

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:greeterAddressOnGoerli', greeterAddressOnGoerli)
    } catch (err: any) {
      console.error(err)
    }
  }, [greeterAddressOnGoerli])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:greeterAddressOnOptimism', greeterAddressOnOptimism)
    } catch (err: any) {
      console.error(err)
    }
  }, [greeterAddressOnOptimism])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:connector', connectorAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [connectorAddress])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:connectorTxOnGoerli', connectorTxOnGoerli)
    } catch (err: any) {
      console.error(err)
    }
  }, [connectorTxOnGoerli])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:connectorTxOnOptimism', connectorTxOnOptimism)
    } catch (err: any) {
      console.error(err)
    }
  }, [connectorTxOnOptimism])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:greetingTxOnGoerli', greetingTxOnGoerli)
    } catch (err: any) {
      console.error(err)
    }
  }, [greetingTxOnGoerli])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:greetingTxOnOptimism', greetingTxOnOptimism)
    } catch (err: any) {
      console.error(err)
    }
  }, [greetingTxOnOptimism])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:messageRelayTxOnGoerli', messageRelayTxOnGoerli)
    } catch (err: any) {
      console.error(err)
    }
  }, [messageRelayTxOnGoerli])

  const { data: greetingMessageOnOptimism } = useQuery(
    [
      `optimismGreetingMessage:${greeterAddressOnOptimism}`,
      address
    ],
    async () => {
      if (!greeterAddressOnOptimism) {
        return ''
      }
      const { abi } = bidirectionalGreeterArtifact
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.optimism)
      const greeter = new Contract(greeterAddressOnOptimism, abi, provider)
      return greeter.greeting()
    },
    {
      enabled: !!greeterAddressOnOptimism,
      refetchInterval: 10 * 1000
    }
  )

  const { data: greetingMessageOnGoerli } = useQuery(
    [
      `goerliGreetingMessage:${greeterAddressOnGoerli}`,
      address
    ],
    async () => {
      if (!greeterAddressOnGoerli) {
        return ''
      }
      const { abi } = bidirectionalGreeterArtifact
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.goerli)
      const greeter = new Contract(greeterAddressOnGoerli, abi, provider)
      return greeter.greeting()
    },
    {
      enabled: !!greeterAddressOnGoerli,
      refetchInterval: 10 * 1000
    }
  )

  async function deployGreeter (chainId: number) {
    const { abi, bytecode } = bidirectionalGreeterArtifact
    const signer = await getSignerOrRequestWallet()
    await checkConnectedNetworkIdOrThrow(chainId)

    const Greeter = new ContractFactory(abi, bytecode, signer)
    const greeter = await Greeter.deploy()
    const tx = greeter.deployTransaction
    await tx.wait()
    return greeter.address
  }

  async function handleDeployGreeterOnGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsDeployingGreeterOnGoerli(true)
      setError('')
      const address = await deployGreeter(5)
      if (address) {
        setGreeterAddressOnGoerli(address)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsDeployingGreeterOnGoerli(false)
  }
  async function handleDeployGreeterOnOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsDeployingGreeterOnOptimism(true)
      setError('')
      const address = await deployGreeter(420)
      if (address) {
        setGreeterAddressOnOptimism(address)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsDeployingGreeterOnOptimism(false)
  }

  async function connectTargets() {
    const signer = await getSignerOrRequestWallet()
    await checkConnectedNetworkIdOrThrow(5)

    const sdk = new Hop('goerli', {
      contractAddresses: {
        5: {
          hubConnectorFactory: hubConnectorFactoryOnGoerliAddress
        }
      }
    })

    const { connectorAddress } = await sdk.connectTargets({
      hubChainId: 5,
      spokeChainId: 420,
      target1: greeterAddressOnGoerli,
      target2: greeterAddressOnOptimism,
      signer
    })

    return connectorAddress
  }

  async function handleConnectTargetsClick (event: any) {
    event.preventDefault()
    try {
      setIsConnectingTargets(true)
      setError('')
      const address = await connectTargets()
      if (address) {
        setConnectorAddress(address)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsConnectingTargets(false)
  }

  async function setConnector (chainId: number, target: string) {
    const signer = await getSignerOrRequestWallet()
    await checkConnectedNetworkIdOrThrow(chainId)

    const { abi } = bidirectionalGreeterArtifact
    const greeter = new Contract(target, abi, signer)
    const tx = await greeter.setConnector(connectorAddress)
    await tx.wait()
    return tx.hash
  }

  async function handleSetConnectorOnGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsSettingConnectorOnGoerli(true)
      setError('')
      const chainId = 5
      const hash = await setConnector(chainId, greeterAddressOnGoerli)
      if (hash) {
        setConnectorTxOnGoerli(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSettingConnectorOnGoerli(false)
  }

  async function handleSetConnectorOnOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsSettingConnectorOnOptimism(true)
      setError('')
      const chainId = 420
      const hash = await setConnector(chainId, greeterAddressOnOptimism)
      if (hash) {
        setConnectorTxOnOptimism(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSettingConnectorOnOptimism(false)
  }

  async function sendGreeting (chainId: number, target: string, greetingMessage: string) {
    const signer = await getSignerOrRequestWallet()
    await checkConnectedNetworkIdOrThrow(chainId)

    if (!greetingMessage) {
      throw new Error('greeting message is required')
    }

    const sdk = new Hop('goerli', {
      contractAddresses: {
        5: {
          startBlock: 8818888,
          hubCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
          spokeCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
          ethFeeDistributor: ''
        },
        420: {
          startBlock: 7947719,
          spokeCoreMessenger: '0x323019fac2d13d439ae94765b901466bfa8eeac1',
          connector: ''
        }
      }
    })

    const messageFee1 = await sdk.getMessageFee({
      fromChainId: chainId,
      toChainId: chainId === 5 ? 420 : 5
    })
    console.log('fee', messageFee1.toString())

    const { abi } = bidirectionalGreeterArtifact
    const greeter = new Contract(target, abi, signer)
    const tx = await greeter.sendGreeting(greetingMessage, {
      // gasLimit: 300_000,
      value: chainId === 420 ? messageFee : '0'
    })
    await tx.wait()
    return tx.hash
  }

  async function handleSendGreetingOnGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsSendingGreetingOnGoerli(true)
      setError('')
      const chainId = 5
      const hash = await sendGreeting(chainId, greeterAddressOnGoerli, greetingMessageFromGoerli)
      if (hash) {
        setGreetingTxOnGoerli(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSendingGreetingOnGoerli(false)
  }

  async function handleSendGreetingOnOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsSendingGreetingOnOptimism(true)
      setError('')
      const chainId = 420
      const hash = await sendGreeting(chainId, greeterAddressOnOptimism, greetingMessageFromOptimism)
      if (hash) {
        setGreetingTxOnOptimism(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSendingGreetingOnOptimism(false)
  }

  async function handleRelayMessageClick(event: any) {
    event.preventDefault()

    try {
      setIsSendingMessageRelayOnGoerli(true)
      const hash = await relayMessage()
      if (hash) {
        setMessageRelayTxOnGoerli(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSendingMessageRelayOnGoerli(false)
  }

  async function relayMessage() {
    const signer = await getSignerOrRequestWallet()
    await checkConnectedNetworkIdOrThrow(5)

    const sdk = new Hop('goerli', {
      contractAddresses: {
        5: {
          startBlock: 8818888,
          hubCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
          spokeCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
          ethFeeDistributor: ''
        },
        420: {
          startBlock: 7947719,
          spokeCoreMessenger: '0x323019fac2d13d439ae94765b901466bfa8eeac1',
          connector: ''
        }
      }
    })

    const fromChainId = 420

    const {
      bundleProof,
      toAddress,
      fromAddress,
      toCalldata,
      toChainId
    } = await sdk.getRelayMessageDataFromTransactionHash({ fromChainId, transactionHash: greetingTxOnOptimism })

    const txData = await sdk.getRelayMessagePopulatedTx({ fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof })
    if (!txData) {
      throw new Error('expected txData')
    }
    console.log('txData:', txData)

    const tx = await signer.sendTransaction(txData)
    console.log('tx', tx.hash)
    return tx.hash
  }

  function resetState() {
    localStorage.removeItem('tutorial:greeterAddressOnGoerli')
    localStorage.removeItem('tutorial:greeterAddressOnOptimism')
    localStorage.removeItem('tutorial:connector')
    localStorage.removeItem('tutorial:connectorTxOnGoerli')
    localStorage.removeItem('tutorial:connectorTxOnOptimism')
    localStorage.removeItem('tutorial:greetingTxOnGoerli')
    localStorage.removeItem('tutorial:greetingTxOnOptimism')
    localStorage.removeItem('tutorial:messageRelayTxOnGoerli')
    setError('')
    setGreeterAddressOnGoerli('')
    setGreeterAddressOnOptimism('')
    setConnectorAddress('')
    setConnectorTxOnGoerli('')
    setConnectorTxOnOptimism('')
    setGreetingTxOnGoerli('')
    setGreetingTxOnOptimism('')
    setMessageRelayTxOnGoerli('')
    setGreetingMessageFromGoerli('Hello from Goerli!')
    setGreetingMessageFromOptimism('Hello from Optimism!')
  }

  return (
    <SiteWrapper>
      {!!address && (
        <Box>
          <Button onClick={disconnectWallet}>disconnect</Button>
        </Box>
      )}

      <Box mb={8} maxWidth="800px" width="100%">
        <Typography variant="h2" mb={4}>Getting Started with Hop Connectors</Typography>

        <Typography mb={4} variant="h3">What’s a Connector?</Typography>

        <Typography mb={4} variant="body1">
        Connectors are contracts deployed in pairs on separate chains that establish a cross-chain connection for their two target contracts. Connectors allow you to build powerful cross-chain applications without any cross-chain logic.
        </Typography>

        <pre>
{`
Arbitrum               |   Optimism
                       |
Target1 <> Connector <-|-> Connector <> Target2
                       |
 `}       </pre>

        <Typography mb={4} variant="body1">
        When a Connector is called by it’s target contract, it encodes the call and passes the message to it's cross-chain counterpart Connector. The Connector at the destination then executes the message by calling it's target with the same calldata received by the Connector on the chain the message was sent from (the "source chain").
        </Typography>

        <Typography mb={4} variant="h3">What’s the catch?</Typography>

        <Typography mb={4} variant="body1">
Connectors are a great way to establish a cross-chain connection between two contracts without introducing cross-chain logic. For more complex cross-chain applications that deal with many-to-many relationships it’s recommended to connect to the Hop messenger directly. <Link href="https://v2-connector-portal.hop.exchange/" target="_blank" rel="noreferrer noopener">Connector Portal ↗</Link>
        </Typography>

        <Typography mb={4} variant="h3">Let's try it out!</Typography>

        <Typography mb={4} variant="body1">For this demo, we’ll deploy a <code>BidirectionalGreeter</code> contract on Goerli and Optimism-Goerli and establish a cross-chain connection with Connectors. On either Greeter contract, sendGreeting can be called which will send a message to the other Greeter and update it’s greeting state. You can follow along with this tutorial using just your MetaMask wallet.</Typography>

        <Typography mb={2} variant="body1">
        If you have any trouble along the way, jump in the <Link href="https://discord.gg/PwCF88emV4" target="_blank" rel="noreferrer noopener">Hop Discord</Link> #💻Dev channel and ask for help.
        </Typography>

        <Typography mb={2} variant="body1">
        Note: You’ll need Goerli ETH on Goerli and Optimism-Goerli for this demo. If you don’t have any, you can get some from the faucet here [Needs link, not sure if there are any faucets that give enough gETH]. You can bridge Goerli ETH to Optimism-Goerli using the <Link href="https://app.hop.exchange" target="_blank" rel="noreferrer noopener">Hop Bridge</Link>.
        </Typography>

        <Typography mb={4} variant="h4">Deploy your cross-chain application</Typography>

        <Typography mb={2} variant="body1">
        Here’s an abridged version of the <code>BidirectionalGreeter</code> contract used in this demo.
          </Typography>

        <Box mb={2}>
          <Syntax
            language="solidity"
            code={`
contract BidirectionalGreeter {
    address public greeterConnector;
    string public greeting;

    event GreetingSent(string newGreeting);
    event GreetingSet(string newGreeting);

    // 🔒 Use established security patterns like \`Ownable\`'s \`onlyOwner\` modifier 🔒
    modifier onlyConnector() {
        // Calls from the paired Greeter contract will come from the connector.
        require(msg.sender == greeterConnector, "BidirectionalGreeter: Only connector");
        _;
    }

    // ✉️ Send a greeting to the paired cross-chain Greeter contract ✉️
    function sendGreeting(string memory newGreeting) external payable {
        // Connectors can be called with a modified interface of the cross-chain contract.
        // It's as if it was on the same chain! No abi encoding required.
        // The forwarded msg.value pays for the message fee.
        ICrossChainGreeter(greeterConnector).setGreeting{value: msg.value}(newGreeting);
        emit GreetingSent(newGreeting);
    }

    // 📬 Receive a greeting from the paired cross-chain Greeter contract 📬
    function setGreeting(string memory newGreeting) external onlyConnector {
        greeting = newGreeting;
        emit GreetingSet(newGreeting);
    }
}
          `.trim()}
          />
        </Box>

        <Typography mb={4} variant="body1">Deploy your own Greeter contracts on Goerli and Optimism-Goerli with MetaMask.</Typography>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>You can follow along the tutorial using your MetaMask wallet.</Typography>
            <Typography variant="body1" mb={2}>Deploy the Greeter contract on Goerli.</Typography>
            <HighlightedButton loading={isDeployingGreeterOnGoerli} disabled={!!greeterAddressOnGoerli} onClick={handleDeployGreeterOnGoerliClick} variant="contained">Deploy Greeter on Goerli</HighlightedButton>

            {!!greeterAddressOnGoerli && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Greeter Goerli address: {greeterAddressOnGoerli}</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Box mb={4}></Box>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Deploy the Greeter contract on Optimism-Goerli.</Typography>

            <HighlightedButton loading={isDeployingGreeterOnOptimism} disabled={!!greeterAddressOnOptimism || !greeterAddressOnGoerli} onClick={handleDeployGreeterOnOptimismClick} variant="contained">Deploy Greeter on Optimism-Goerli</HighlightedButton>

            {!greeterAddressOnGoerli && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Deploy Goerli contract first before trying to deploy on Optimism-Goerli</em></Typography>
            )}

            {!!greeterAddressOnOptimism && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Greeter Optimism-Goerli address: {greeterAddressOnOptimism}</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Typography mt={4} mb={4} variant="h4">Deploy your Connectors</Typography>

        <Typography mt={4} mb={2} variant="body1">Next, we’ll connect our two Greeter contracts with Connectors. A pair of Connectors can be deployed by navigating to the <Link href="https://v2-connector-portal.hop.exchange/" target="_blank" rel="noreferrer noopener">Connector Portal ↗</Link> and submitting your two target addresses (your Greeter contracts) and their respective chainId's (<code>5</code> for Goerli and <code>420</code> for Optimism-Goerli).</Typography>

        <Box mb={4}>
          <Link href="https://v2-connector-portal.hop.exchange/" target="_blank" rel="noreferrer noopener">Connector Portal ↗</Link>
        </Box>

        <Typography mt={4} mb={2} variant="body1">✨With a bit of create2 magic, paired connectors are deployed to the same address on their respective chains. ✨</Typography>


        <Typography mt={4} mb={2} variant="body1">Alternatively, you can call the <code>ConnectorFactory</code> on Goerli directly.</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const tx = await ConnectorFactory.connectTargets(
  chainId1,
  target1,
  chainId2,
  target2
)

console.log('tx:', tx.hash)
const receipt = await tx.wait()
const event = receipt.events?.find(
  event => event.event === 'ConnectorDeployed'
)

// This is the address of both connectors on their respective chain
const connectorAddress = event?.args?.connector
          `.trim()}
          />
        </Box>

        <Typography mt={4} mb={4} variant="h4">Complete your cross-chain connection</Typography>

        <Typography mt={4} variant="body1">Now that you’re Connectors are deployed, let’s complete your cross-chain connection by setting the connector address for each of your Greeter contracts.</Typography>

        <Box mb={2}>
          <Syntax
          code={`
greater.setConnector(connectorAddress)
          `.trim()}
          />
        </Box>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Set the connector address on Goerli Greeter contract.</Typography>
            <HighlightedButton loading={isSettingConnectorOnGoerli} disabled={!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism) || !!connectorTxOnGoerli} onClick={handleSetConnectorOnGoerliClick} variant="contained">Set Connector on Goerli</HighlightedButton>

            {!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Connect targets first to get connect address in order to set connector</em></Typography>
            )}

            {!!connectorTxOnGoerli && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Connector on Goerli set</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Box mb={4}></Box>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Set the connector address on Optimism-Goerli Greeter contract.</Typography>
            <HighlightedButton loading={isSettingConnectorOnOptimism} disabled={!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli) || !!connectorTxOnOptimism} onClick={handleSetConnectorOnOptimismClick} variant="contained">Set Connector on Optimism-Goerli</HighlightedButton>

            {!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set connector address on Goerli contract first before setting it on Optimism-Goerli contract</em></Typography>
            )}

            {!!connectorTxOnOptimism && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Connector on Optimism-Goerli set</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        {connectorTxOnOptimism && (
          <Box mt={4} mb={4}>
            <img width="300px" src="https://user-images.githubusercontent.com/168240/232550112-774f155e-074a-42d2-996a-9770def474b0.png" alt="" />
          </Box>
        )}

        <Typography mt={4} mb={4} variant="h4">Send a cross-chain greeting from L1</Typography>

        <Typography mb={4} variant="body1">On your Goerli Greeter, call <code>sendGreeting</code> with you personalized greeting.</Typography>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Send a greeting message from Goerli to Optimism-Goerli.</Typography>
            <Box mb={2}>
              <CustomTextField value={greetingMessageFromGoerli} onChange={(event: any) => setGreetingMessageFromGoerli(event.target.value)} placeholder="Greeting messsage" />
            </Box>
            <HighlightedButton loading={isSendingGreetingOnGoerli} disabled={!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli && connectorTxOnOptimism)} onClick={handleSendGreetingOnGoerliClick} variant="contained">Send Greeting from Goerli</HighlightedButton>

            {!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli && connectorTxOnOptimism) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set connector addresses first before sending greeting messages</em></Typography>
            )}

            {!!greetingTxOnGoerli && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Greeting from Goerli sent</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Box mb={4}></Box>
        <Typography mb={2} variant="body1">Cross-chain messages from Goerli to Optimism-Goerli  are executed automatically. This usually takes about 20 minutes. After some time, check if your Optimism-Goerli Greeter state has updated.</Typography>

        <Box mb={4}></Box>
        {(!greetingMessageOnOptimism && greetingTxOnGoerli) && (
          <Typography mb={2} variant="body1">Waiting for greeting message to arrive on Optimism-Goerli...</Typography>
        )}
        {greetingMessageOnOptimism && (
          <Alert severity="success">
            <Typography mb={2} variant="body1">Greeting message on Optimism-Goerli: {greetingMessageOnOptimism ? <strong>{greetingMessageOnOptimism}</strong> : <em style={{ opacity: 0.2 }}>no message</em>}</Typography>
          </Alert>
        )}

        <Typography mt={4} mb={4} variant="h4">Send a cross-chain greeting from L2</Typography>

        <Typography mb={2} variant="body1">On your Optimism-Goerli Greeter, call <code>sendGreeting</code> with you personalized greeting.</Typography>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Send a greeting message from Optimism-Goerli to Goerli.</Typography>
            <Box mb={2}>
              <CustomTextField value={greetingMessageFromOptimism} onChange={(event: any) => setGreetingMessageFromOptimism(event.target.value)} placeholder="Greeting messsage" />
            </Box>
            <HighlightedButton loading={isSendingGreetingOnOptimism} disabled={!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli && connectorTxOnOptimism)} onClick={handleSendGreetingOnOptimismClick} variant="contained">Send greeting on Optimism</HighlightedButton>

            {!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli && connectorTxOnOptimism) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set connector addresses first before sending greeting messages</em></Typography>
            )}

            {!!greetingTxOnOptimism && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Greeting message on Optimism sent</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Typography mt={4} mb={2} variant="body1">The message from Optimism-Goerli to Goerli can only be exited after the bundle reaches the destination (Goerli). This will take a few minutes.</Typography>

        <Box mb={4}></Box>
        {typeof isL2TxHashExited === 'boolean' && (
          <Typography mb={2} variant="body1">{isL2TxHashExited ? (
              <Alert severity="success">
              Bundle exited successfully
              </Alert>
          )
          : '⌛Waiting for bundle to be exited...'}</Typography>
        )}

        <Box mb={4}></Box>
        <Typography mb={2} variant="body1">Once your message is ready to be executed, you can execute the cross-chain message using the Hop SDK.</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const messageStatus = await hopSdk.getMessageStatus(txHash)

if (messageStatus === MessageStatus.READY_TO_EXECUTE) {
  cont tx = await hopSdk.executeMessage(txHash)
  const rcpt = await tx.wait()
}
          `.trim()}
          />
        </Box>

        <CustomPaper>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>You can follow along the tutorial using your MetaMask wallet.</Typography>
            <Typography variant="body1" mb={2}>Relay the message on Goerli to finalize the exit transaction.</Typography>
            <HighlightedButton loading={isSendingMessageRelayOnGoerli} disabled={!isL2TxHashExited} onClick={handleRelayMessageClick} variant="contained">Relay Message on Goerli</HighlightedButton>

            {!(connectorAddress && greeterAddressOnGoerli && greeterAddressOnOptimism && connectorTxOnGoerli && connectorTxOnOptimism && greetingTxOnOptimism) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Send greeting message from Optimism-Goerli to Goerli first</em></Typography>
            )}

            {!!messageRelayTxOnGoerli && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Message relay tx on Goerli sent</Alert>
              </Box>
            )}
          </Box>
        </CustomPaper>

        <Box mb={4}></Box>
        {(!greetingMessageOnGoerli && greetingTxOnOptimism && messageRelayTxOnGoerli) && (
          <Typography mb={2} variant="body1">Waiting for greeting message to arrive on Goerli...</Typography>
        )}

          <Typography mb={2} variant="body1">Your greeting should now be set on your Goerli Greeter contract.</Typography>

        {greetingMessageOnGoerli && (
          <Alert severity="success">
            <Typography mb={2} variant="body1">Greeting message on Goerli: {greetingMessageOnGoerli ? <strong>{greetingMessageOnGoerli}</strong> : <em style={{ opacity: 0.2 }}>no message</em>}</Typography>
          </Alert>
        )}

        <Box mb={4}></Box>

        <Typography mt={4} mb={4} variant="h4">Great work!</Typography>

        <Typography mt={4} variant="body1">You’ve now deployed and connected your cross-chain application and sent messages between your connected pair of contracts. Hop Connectors handled all of the cross-chain logic keeping your application simple and secure. 💪</Typography>

        {/*<Typography mt={4} variant="body1">For building more complex cross-chain applications, try sending and receiving messages directly from the Hop Core Messenger. ↗[Needs link]</Typography>*/}

        {!!error && (
          <Box mt={2} mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!!greeterAddressOnGoerli && (
          <Box mt={4}>
            <Button onClick={resetState} variant="contained">Reset tutorial</Button>
          </Box>
        )}
      </Box>
    </SiteWrapper>
  )
}
