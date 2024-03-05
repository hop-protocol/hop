import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { SiteWrapper } from '../components/SiteWrapper'
import { providers, Contract, ContractFactory } from 'ethers'
import { getAddress, formatEther } from 'ethers/lib/utils'
import { useWeb3 } from '../hooks/useWeb3'
import pingPongArtifact from '../abi/PingPong.json'
import hubConnectorFactoryArtifact from '../abi/HubERC5164ConnectorFactory.json'
import Alert from '@mui/material/Alert'
import { Syntax } from '../components/Syntax'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useQuery } from 'react-query'
import '../tutorial.css'

export function PingPongTutorial () {
  const { provider, address, requestWallet, disconnectWallet, checkConnectedNetworkId } = useWeb3()
  const [error, setError] = useState('')
  const [isDeployingTarget1, setIsDeployingTarget1] = useState(false)
  const [isDeployingTarget2, setIsDeployingTarget2] = useState(false)
  const [isConnectingTargets, setIsConnectingTargets] = useState(false)
  const [isSettingCounterpartGoerli, setIsSettingCounterpartGoerli] = useState(false)
  const [isSettingCounterpartOptimism, setIsSettingCounterpartOptimism] = useState(false)
  const [isSendingPingGoerli, setIsSendingPingGoerli] = useState(false)
  const [isSendingPingOptimism, setIsSendingPingOptimism] = useState(false)

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

  const [target1, setTarget1] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:target1')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [target2, setTarget2] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:target2')
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

  const [counterpartGoerliTx, setCounterpartGoerliTx] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:counterpartGoerliTx')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [counterpartOptimismTx, setCounterpartOptimismTx] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:counterpartOptimismTx')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [pingGoerliTx, setPingGoerliTx] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:pingGoerliTx')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const [pingOptimismTx, setPingOptimismTx] = useState(() => {
    try {
      const cached = localStorage.getItem('tutorial:pingOptimismTx')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const { data: goerliContractStats } = useQuery(
    [
      `goerliContractStats:${target1}`,
      address
    ],
    async () => {
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.goerli)
      const { abi } = pingPongArtifact
      const pingPong = new Contract(target1, abi, provider)
      const messagesSent = await pingPong.messagesSent()
      const messagesReceived = await pingPong.messagesReceived()
      return {
        messagesSent: messagesSent.toString(),
        messagesReceived: messagesReceived.toString()
      }
    },
    {
      enabled: !!target1,
      refetchInterval: 30 * 1000
    }
  )

  const { data: optimismContractStats } = useQuery(
    [
      `optimismContractStats:${target2}`,
      address
    ],
    async () => {
      const provider = new providers.StaticJsonRpcProvider(rpcUrls.optimism)
      const { abi } = pingPongArtifact
      const pingPong = new Contract(target2, abi, provider)
      const messagesSent = await pingPong.messagesSent()
      const messagesReceived = await pingPong.messagesReceived()
      return {
        messagesSent: messagesSent.toString(),
        messagesReceived: messagesReceived.toString()
      }
    },
    {
      enabled: !!target2,
      refetchInterval: 30 * 1000
    }
  )

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:target1', target1)
    } catch (err: any) {
      console.error(err)
    }
  }, [target1])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:target2', target2)
    } catch (err: any) {
      console.error(err)
    }
  }, [target2])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:connector', connectorAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [connectorAddress])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:counterpartGoerliTx', counterpartGoerliTx)
    } catch (err: any) {
      console.error(err)
    }
  }, [counterpartGoerliTx])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:counterpartOptimismTx', counterpartOptimismTx)
    } catch (err: any) {
      console.error(err)
    }
  }, [counterpartOptimismTx])

  useEffect(() => {
    try {
      localStorage.setItem('tutorial:pingGoerliTx', pingGoerliTx)
    } catch (err: any) {
      console.error(err)
    }
  }, [pingGoerliTx])

  async function deployPingPong (chainId: number) {
    const { abi, bytecode } = pingPongArtifact
    await requestWallet()
    const signer = provider?.getSigner()
    await checkConnectedNetworkId(chainId)

    const PingPong = new ContractFactory(abi, bytecode, signer)
    const pingPong = await PingPong.deploy()
    const tx = pingPong.deployTransaction
    await tx.wait()
    return pingPong.address
  }

  async function handleDeployPingPongGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsDeployingTarget1(true)
      setError('')
      const address = await deployPingPong(5)
      if (address) {
        setTarget1(address)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsDeployingTarget1(false)
  }
  async function handleDeployPingPongOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsDeployingTarget2(true)
      setError('')
      const address = await deployPingPong(420)
      if (address) {
        setTarget2(address)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsDeployingTarget2(false)
  }

  async function connectTargets() {
    await requestWallet()
    const signer = provider?.getSigner()
    await checkConnectedNetworkId(5)

    const factoryAddress = '0xeA72163fb54A9bD84F49F2f08D7Cc9bc1b68A649'
    const { abi } = hubConnectorFactoryArtifact
    const factory = new Contract(factoryAddress, abi, signer)
    const chainId1 = 5
    const chainId2 = 420
    const tx = await factory.connectTargets(chainId1, target1, chainId2, target2)
    const receipt = await tx.wait()
    const event = receipt.events?.find(
      (event: any) => event.event === 'ConnectorDeployed'
    )
    const connectorAddress = getAddress(event?.args?.connector)
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

  async function setCounterpart (chainId: number, target: string) {
    await requestWallet()
    const signer = provider?.getSigner()
    await checkConnectedNetworkId(chainId)

    const { abi } = pingPongArtifact
    const pingPong = new Contract(target, abi, signer)
    const tx = await pingPong.setCounterpart(connectorAddress)
    await tx.wait()
    return tx.hash
  }

  async function handleSetCounterpartGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsSettingCounterpartGoerli(true)
      setError('')
      const hash = await setCounterpart(5, target1)
      if (hash) {
        setCounterpartGoerliTx(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSettingCounterpartGoerli(false)
  }

  async function handleSetCounterpartOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsSettingCounterpartOptimism(true)
      setError('')
      const hash = await setCounterpart(420, target2)
      if (hash) {
        setCounterpartOptimismTx(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSettingCounterpartOptimism(false)
  }

  async function sendPing (chainId: number, target: string) {
    await requestWallet()
    const signer = provider?.getSigner()
    await checkConnectedNetworkId(chainId)

    const { abi } = pingPongArtifact
    const pingPong = new Contract(target, abi, signer)
    const tx = await pingPong.ping(0, {
      value: chainId === 420 ? '1000000000' : '0'
    })
    await tx.wait()
    return tx.hash
  }

  async function handleSendPingGoerliClick (event: any) {
    event.preventDefault()
    try {
      setIsSendingPingGoerli(true)
      setError('')
      const hash = await sendPing(5, target1)
      if (hash) {
        setPingGoerliTx(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSendingPingGoerli(false)
  }

  async function handleSendPingOptimismClick (event: any) {
    event.preventDefault()
    try {
      setIsSendingPingOptimism(true)
      setError('')
      const hash = await sendPing(420, target2)
      if (hash) {
        setPingOptimismTx(hash)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setIsSendingPingOptimism(false)
  }

  function resetState() {
    localStorage.removeItem('tutorial:target1')
    localStorage.removeItem('tutorial:target2')
    localStorage.removeItem('tutorial:connector')
    localStorage.removeItem('tutorial:counterpartGoerliTx')
    localStorage.removeItem('tutorial:counterpartOptimismTx')
    localStorage.removeItem('tutorial:sentPingGoerliTx')
    setTarget1('')
    setTarget2('')
    setConnectorAddress('')
    setCounterpartGoerliTx('')
    setCounterpartOptimismTx('')
    setPingGoerliTx('')
  }

  return (
    <SiteWrapper>
      {!!address && (
        <Box>
          <Button onClick={disconnectWallet}>disconnect</Button>
        </Box>
      )}

      <Box mb={8} maxWidth="800px" width="100%">
        <Typography variant="h2" mb={4}>Tutorial: Connector Demo</Typography>

        <Typography mb={4} variant="body1">This tutorial will show you to easy it is to make any smart contract into a cross-chain smart contract by connecting the Hop messenger to it. It'll walk you through deploying simple contracts on two different chains, connecting these contracts with messengers, and seamlessly sending messages from one contract to the other while verifying the sender.</Typography>

        <Typography mb={4} variant="body1">The demo <em>PingPong</em> contracts will be deployed to L1 Goerli and L2 Optimism (Goerli) and will show how to send a message (ping) from one chain to another, and have the destination chain send a message back to the source chain (pong). </Typography>

        <Typography mb={4} variant="h4">Faucet</Typography>

        <Typography mb={2} variant="body1">
          To follow along the tutorial, you will need some testnet ETH on both Goerli and Optimism (Goerli).
        </Typography>

        <Typography mb={2} variant="body1">
          You can request Goerli ETH from this faucet: <Link href="https://faucet.paradigm.xyz/" target="_blank" rel="noreferrer noopener">https://faucet.paradigm.xyz ↗</Link>
        </Typography>

        <Typography variant="body1">
          After receiving Goerli ETH, bridge some to Optimism (Goerli) using the native bridge: <Link href="https://app.optimism.io/bridge" target="_blank" rel="noreferrer noopener">https://app.optimism.io/bridge ↗</Link>
        </Typography>

        {!address && (
          <Box mt={4}>
            <LoadingButton loading={false} disabled={false} onClick={requestWallet} variant="contained">Check balance</LoadingButton>
          </Box>
        )}

        {!!address && (
          <Typography mt={2} variant="body1">
            Connected account: {address}
          </Typography>
        )}

        {!!goerliBalance?.formattedBalance && (
          <Typography mt={2} variant="body1">
            Goerli ETH Balance: {goerliBalance.formattedBalance}
          </Typography>
        )}

        {!!optimismBalance?.formattedBalance && (
          <Typography mt={2} variant="body1">
            Optimism ETH Balance: {optimismBalance.formattedBalance}
          </Typography>
        )}

        <Typography mt={2} variant="body1">
          Once you have ETH, let's continue to setup a Hardhat project in the next section.
        </Typography>

        <Typography variant="h4" mt={4} mb={4}>Create Hardhat Project</Typography>

        <Typography variant="body1">Initialize a new <Link href="https://hardhat.org/" target="_blank" rel="noreferrer noopener">Hardhat</Link> project with the following commands:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
mkdir demo
cd demo/
npx hardhat
# Select "Create a basic sample project" when prompted.
            `.trim()}
            />
        </Box>

        <Typography variant="body1">Also install the <code>dotenv</code> dependency since we'll be adding environment variables:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npm i dotenv --save-dev
            `.trim()}
            />
        </Box>

        <Typography variant="body1">Edit <code>hardhat.config.js</code> with the following to import the private key and set the Goerli and Optimism (Goerli) RPC config:</Typography>

        <Box mb={2}>
          <Syntax
          code={`
require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY
if (!privateKey) {
  throw new Error('PRIVATE_KEY not set')
}

module.exports = {
  solidity: '0.8.4',
  networks: {
    optimism: {
      url: 'https://rpc.ankr.com/optimism_testnet',
      accounts: [privateKey]
    },
    goerli: {
      url: 'https://rpc.ankr.com/eth_goerli',
      accounts: [privateKey]
    }
  }
}
          `.trim()}
          />
        </Box>

        <Typography mb={4} variant="h4">Set signing key</Typography>

        <Typography variant="body1">Create a <code>.env</code> file with the following environment variable (replace with your private key string) that will be used for signing transactions. Make sure this account has testnet ETH on both Goerli and Optimism (Goerli):</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
# Set your private key here for signing transactions
PRIVATE_KEY=123...
          `.trim()}
          />
        </Box>

        <Typography mb={4} variant="h4">Deploy Sender and Receiver Contracts</Typography>

        <Typography mb={2} variant="body1">
        We're going to deploy simple sender and receiver contract on two different chains. These will be the PingPong contracts and will live on Goerli and Optimism (Goerli).
          </Typography>

        <Typography variant="body1">Create <code>contracts/PingPing.sol</code> contract file with the following:</Typography>

        <Box mb={2}>
          <Syntax
            language="solidity"
            code={`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract PingPong {
    address public counterpart;
    uint256 public messagesSent = 0;
    uint256 public messagesReceived = 0;

    event Ping(uint256 rallyCount);
    event Pong(uint256 rallyCount);

    // Uses standard access controls. No cross-chain logic required!
    modifier onlyCounterpart() {
        require(msg.sender == counterpart, "PingPong: only counterpart");
        _;
    }

    function setCounterpart(address _counterpart) external {
        require(counterpart == address(0), "PingPong: counterpart already set");
        require(_counterpart != address(0), "PingPong: counterpart cannot be zero address");
        counterpart = _counterpart;
    }

    function ping(uint256 rallyCount) public payable {
        // Track number of messages sent for demonstration purposes
        messagesSent++;
        emit Ping(rallyCount);

        // The message fee (msg.value) is forwarded to the connector
        PingPong(counterpart).pong{value: msg.value}(rallyCount);
    }

    function pong(uint256 rallyCount) external payable onlyCounterpart {
        // Track number of messages received for demonstration purposes
        messagesReceived++;
        emit Pong(rallyCount);

        // If rally is not over, send a ping back
        if (rallyCount > 0) {
            ping(rallyCount - 1);
        }
    }
}
          `.trim()}
          />
        </Box>

        <Typography variant="body1">Create deploy script <code>scripts/deployPingPong.js</code> with the following:</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const hre = require('hardhat')

async function main() {
  const PingPong = await hre.ethers.getContractFactory('PingPong')
  const pingPong = await PingPong.deploy()

  await pingPong.deployed()

  console.log('PingPong deployed to:', pingPong.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
          `.trim()}
          />
        </Box>

        <Typography variant="body1">Deploy PingPong contract to Goerli with the following command:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network goerli scripts/deployPingPong.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should print the deployed contract address on Goerli:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
Compiled 3 Solidity files successfully
PingPong deployed to: ${target1 || '0xf92201C1113f6164C47115976c1330b87273e476'}
          `.trim()}
          />
        </Box>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>You can follow along the tutorial using your MetaMask wallet.</Typography>
            <Typography variant="body1" mb={2}>Deploy the PingPong contract on Goerli.</Typography>
            <LoadingButton loading={isDeployingTarget1} disabled={!!target1} onClick={handleDeployPingPongGoerliClick} variant="contained">Deploy PingPong on Goerli</LoadingButton>

            {!!target1 && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">PingPong Goerli address: {target1}</Alert>
              </Box>
            )}
          </Box>
        </Card>

        <Typography mt={4} variant="body1">Deploy PingPong contract to Optimism (Goerli) with the following command:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network optimism scripts/deployPingPong.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should print the deployed PingPong contract address on Optimism (Goerli):</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
PingPong deployed to: ${target2 || '0xE85e906473C7F5529dDDfA13d03901B5Ea672b88'}
          `.trim()}
          />
        </Box>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Deploy the PingPong contract on Optimism (Goerli).</Typography>

            <LoadingButton loading={isDeployingTarget2} disabled={!!target2 || !target1} onClick={handleDeployPingPongOptimismClick} variant="contained">Deploy PingPong on Optimism (Goerli)</LoadingButton>

            {!target1 && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Deploy Goerli contract first before trying to deploy on Optimism (Goerli)</em></Typography>
            )}

            {!!target2 && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">PingPong Optimism (Goerli) address: {target2}</Alert>
              </Box>
            )}
          </Box>
        </Card>

        {/*
        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npm i @openzeppelin/contracts --save
git clone https://github.com/hop-protocol/contracts-v2
          `.trim()}
          />
        </Box>
        */}

        <Typography mt={4} mb={4} variant="h4">Connect Targets</Typography>

        <Typography mt={4} mb={2} variant="body1">The next step is to connect the two PingPong contracts using the Hub Connector Factory and in return get the connector address.</Typography>

        <Typography mt={4} mb={2} variant="body1">On Goerli, the Hub Connector Factory is at <code>0x34655508eb75469dd240A5C1b47594386a67C6b2</code>.</Typography>

        <Typography variant="body1">Create <code>scripts/connectTargets.js</code> with the following. Replace the <code>target1</code> and <code>target2</code> addresses with your Goerli and Optimism (Goerli) PingPong contract addresses respectively:</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const hre = require('hardhat')

async function main() {
  const connectorFactory = '0x34655508eb75469dd240A5C1b47594386a67C6b2' // on goerli
  const target1 = '${target1 || '0xf92201C1113f6164C47115976c1330b87273e476'}' // goerli
  const target2 = '${target2 || '0xE85e906473C7F5529dDDfA13d03901B5Ea672b88'}' // optimism
  const hubChainId = 5
  const spokeChainId = 420

  const HubConnectorFactory = await hre.ethers.getContractFactory('HubERC5164ConnectorFactory')
  const hubConnectorFactory = HubConnectorFactory.attach(connectorFactory)

  await hubConnectorFactory.deployed()

  const tx = await hubConnectorFactory.connectTargets(
    hubChainId,
    target1,
    spokeChainId,
    target2
  )

  console.log('tx:', tx.hash)
  const receipt = await tx.wait()
  const event = receipt.events?.find(
    event => event.event === 'ConnectorDeployed'
  )
  const connectorAddress = event?.args?.connector
  console.log('connector address:', connectorAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
          `.trim()}
          />
        </Box>

        <Typography mt={4} variant="body1">Connect the target addresses by running the script and it'll print the newly deployed connector address:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network goerli scripts/connectTargets.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should look like this:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
tx: 0x33b5980b0a29288cecf0a5fccfd0996c2b2383e99f42f7453c58e4d94eeb0e18
connector address: ${connectorAddress || '0x981df0d837f03a80031AE1ba60828283734b0efD'}
          `.trim()}
          />
        </Box>

        <Typography mb={2} variant="body1">When connecting the targets, the hub contract on Goerli creates a new connector contract on Goerli, and then sends a message to Optimism (Goerli) to create a connector there. The new connector address will be the same address for both Goerli and Optimism (Goerli).</Typography>

        <Typography mb={2} variant="body1">What the connector contract allows for is to be able to invoke contract calls on the connector address as if you're calling a regular method on the destination contract, except it'll forward that call cross-chain using the native bridge messenger.</Typography>

        <Typography mb={2} variant="body1">The connector address is referred here at the <code>counterpart</code> in the PingPong contract; for example, if you recall the <code>{'PingPong(counterpart).pong{value: msg.value}(rallyCount);'}</code> line, this is actually sending a message over the bridge to invoke the <code>pong</code> on the target address!</Typography>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Create a new connectors for the PingPong contracts.</Typography>
            <LoadingButton loading={isConnectingTargets} disabled={!(target1 && target2) || !!connectorAddress} onClick={handleConnectTargetsClick} variant="contained">Connect Targets</LoadingButton>

            {!(target1 && target2) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Goerli and Optimism (Goerli) contract must be deployed first in order to connect targets</em></Typography>
            )}

            {!!connectorAddress && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Connector Goerli and Optimism (Goerli) address: {connectorAddress}</Alert>
              </Box>
            )}
          </Box>
        </Card>

        <Typography mt={4} mb={4} variant="body1">
          Alternatively, you can use the <Link href="https://v2-connector-portal.hop.exchange/" target="_blank" rel="noreferrer noopener">Connector Portal ↗</Link> UI to connect targets.
        </Typography>

        <Typography mt={4} mb={4} variant="h4">Set Counterpart on Sender and Receiver contracts</Typography>

        <Typography mt={4} variant="body1">The next step is to make the PingPong contracts aware of the connector contracts to be able to forward messages cross-chain. Create <code>scripts/setCounterpart.js</code> with the following to set the connector address, known as <code>counterpart</code>, on each PingPong contract. Make sure to replace <code>connectorAddress</code>, <code>target1</code>, and <code>target2</code> with your own addresses from the previous steps:</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const hre = require('hardhat')

async function main() {
  const connectorAddress = '${connectorAddress || '0x981df0d837f03a80031AE1ba60828283734b0efD'}'
  const target1 = '${target1 || '0xf92201C1113f6164C47115976c1330b87273e476'}' // goerli
  const target2 = '${target2 || '0xE85e906473C7F5529dDDfA13d03901B5Ea672b88'}' // optimism

  const target = hre.network.name === 'optimism' ? target2 : target1
  const PingPong = await hre.ethers.getContractFactory('PingPong')
  const pingPong = await PingPong.attach(target)
  await pingPong.deployed()

  const tx = await pingPong.setCounterpart(connectorAddress)
  console.log('tx:', tx.hash)
  await tx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
          `.trim()}
          />
        </Box>

        <Typography mt={4} variant="body1">Set the PingPong counterpart on Goerli with the following command:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network goerli scripts/setCounterpart.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should print the Goerli transaction hash:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
tx: 0xe98147b2decd1b930732f0e0ab5b2ef032592d62d73670f9db6bbbf126478fc4
          `.trim()}
          />
        </Box>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Set the connector address on Goerli PingPong contract.</Typography>
            <LoadingButton loading={isSettingCounterpartGoerli} disabled={!(connectorAddress && target1 && target2) || !!counterpartGoerliTx} onClick={handleSetCounterpartGoerliClick} variant="contained">Set Counterpart on Goerli</LoadingButton>

            {!(connectorAddress && target1 && target2) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Connect targets first to get connect address in order to set counterpart</em></Typography>
            )}

            {!!counterpartGoerliTx && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Counterpart on Goerli set</Alert>
              </Box>
            )}
          </Box>
        </Card>

        <Typography mt={4} variant="body1">Set the PingPong counterpart on Optimism (Goerli) with the following command:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network optimism scripts/setCounterpart.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should print the Optimism (Goerli) transaction hash:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
tx: 0xcb9024d0d94cc45c84b6aa5812590a8385a9d2e8fa99d34b1bdfa0d046d9dadd
          `.trim()}
          />
        </Box>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Set the connector address on Optimism (Goerli) PingPong contract.</Typography>
            <LoadingButton loading={isSettingCounterpartOptimism} disabled={!(connectorAddress && target1 && target2 && counterpartGoerliTx) || !!counterpartOptimismTx} onClick={handleSetCounterpartOptimismClick} variant="contained">Set Counterpart on Optimism (Goerli)</LoadingButton>

            {!(connectorAddress && target1 && target2 && counterpartGoerliTx) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set counterpart address on Goerli contract first before setting it on Optimism (Goerli) contract</em></Typography>
            )}

            {!!counterpartOptimismTx && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Counterpart on Optimism (Goerli) set</Alert>
              </Box>
            )}
          </Box>
        </Card>

        <Typography mt={4} mb={4} variant="h4">Send Ping, Receive Pong</Typography>

        <Typography variant="body1">Now we can send a Ping message to the Goerli PingPong contract by calling <code>ping()</code> which should send a message cross-chain to the Optimism (Goerli) PingPong contract and call the <code>pong</code> method. Create <code>scripts/sendPing.js</code> with the following. Replace <code>target1</code>, and <code>target2</code> with your own addresses:</Typography>

        <Box mb={2}>
          <Syntax
          code={`
const hre = require('hardhat')

async function main() {
  const target1 = '${target1 || '0xf92201C1113f6164C47115976c1330b87273e476'}' // goerli
  const target2 = '${target2 || '0xE85e906473C7F5529dDDfA13d03901B5Ea672b88'}' // optimism

  const target = hre.network.name === 'optimism' ? target2 : target1
  const fee = hre.network.name === 'optimism' ? '1000000000' : '0'
  const PingPong = await hre.ethers.getContractFactory('PingPong')
  const pingPong = await PingPong.attach(target)
  await pingPong.deployed()

  const tx = await pingPong.ping(0, {
    value: fee
  })
  console.log('tx:', tx.hash)
  const receipt = await tx.wait()

  const messagesSent = await pingPong.messagesSent()
  console.log('messagesSent:', messagesSent.toString())

  const messagesReceived = await pingPong.messagesReceived()
  console.log('messagesReceived:', messagesReceived.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
          `.trim()}
          />
        </Box>

        <Typography mt={4} variant="body1">Send the Ping message on Goerli with the following command:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
npx hardhat run --network goerli scripts/sendPing.js
          `.trim()}
          />
        </Box>

        <Typography variant="body1">The output should pring that it sent a message:</Typography>

        <Box mb={2}>
          <Syntax
          language="bash"
          code={`
tx: 0xf16e06d3e49e78ee2a368251a52e6fbcce14d0512a2cd2f23ede8283f0dd9e1c
messagesSent: 1
messagesReceived: 0
          `.trim()}
          />
        </Box>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Send a ping message from Goerli to Optimism (Goerli).</Typography>
            <LoadingButton loading={isSendingPingGoerli} disabled={!(connectorAddress && target1 && target2 && counterpartGoerliTx && counterpartOptimismTx)} onClick={handleSendPingGoerliClick} variant="contained">Send Ping on Goerli</LoadingButton>

            {!(connectorAddress && target1 && target2 && counterpartGoerliTx && counterpartOptimismTx) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set counterpart addresses first before sending ping messages</em></Typography>
            )}

            {!!pingGoerliTx && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Ping on Goerli sent</Alert>
              </Box>
            )}

            {(!!target1 && !!goerliContractStats) && (
              <>
                <Typography mt={4} variant="body1">
                  Messages Sent on Goerli: {goerliContractStats?.messagesSent}
                </Typography>
                <Typography variant="body1">
                  Messages Received on Goerli: {goerliContractStats?.messagesReceived}
                </Typography>
              </>
            )}
          </Box>
        </Card>

        <Box mb={4}></Box>
        <Typography mb={2} variant="body1">After sending a message from Goerli to Optimism (Goerli), you should see the <em>Messages Sent</em> count increase by 1 on the Goerli PingPong contract, and <em>Messages Received</em> count increase by 1 on the  Optimism (Goerli) PingPong contract after a few seconds.</Typography>

        <Card>
          <Box p={2}>
            <Typography variant="h5" mb={2}>Try It!</Typography>
            <Typography variant="body1" mb={2}>Send a ping message from Optimism (Goerli) to Goerli.</Typography>
            <LoadingButton loading={isSendingPingOptimism} disabled={!(connectorAddress && target1 && target2 && counterpartGoerliTx && counterpartOptimismTx)} onClick={handleSendPingOptimismClick} variant="contained">Send Ping on Optimism</LoadingButton>

            {!(connectorAddress && target1 && target2 && counterpartGoerliTx && counterpartOptimismTx) && (
              <Typography variant="body2" mt={2} style={{ opacity: 0.5 }}><em>Set counterpart addresses first before sending ping messages</em></Typography>
            )}

            {!!pingOptimismTx && (
              <Box mt={2} width="100%" style={{ wordBreak: 'break-word' }}>
                <Alert severity="success">Ping on Optimism sent</Alert>
              </Box>
            )}

            {(!!target2 && !!optimismContractStats) && (
              <>
                <Typography mt={2} variant="body1">
                  Messages Sent on Optimism (Goerli): {optimismContractStats?.messagesSent}
                </Typography>
                <Typography variant="body1">
                  Messages Received on Optimism (Goerli): {optimismContractStats?.messagesReceived}
                </Typography>
              </>
            )}
          </Box>
        </Card>

        <Typography mt={4} variant="body1">Congrats! This concludes the tutorial. We went over how to set up a simple PingPong contract and deployed them to two chains. We then deployed new connector contracts that that are responsible for fowarding messages to the target (PingPong) contracts. Afterwards, we made the PingPong contracts aware of the new connector contracts by configuring their counterparts. And finally, we sent a couple cross-chain messages back and forth.</Typography>

        {!!error && (
          <Box mt={2} mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!!target1 && (
          <Box mt={4}>
            <Button onClick={resetState} variant="contained">Reset tutorial</Button>
          </Box>
        )}

        <Typography mt={4} variant="h4">References</Typography>
        <ul>
          <li><Link href="https://v2-connector-portal.hop.exchange/" target="_blank" rel="noreferrer noopener">Connector Portal ↗</Link></li>
          <li><Link href="https://github.com/hop-protocol/contracts-v2/blob/master/packages/connectors/contracts/test" target="_blank" rel="noreferrer noopener">PingPong Contracts↗</Link></li>
          <li><Link href="https://github.com/hop-protocol/contracts-v2/tree/master/packages/connectors/contracts" target="_blank" rel="noreferrer noopener">Connector Contracts↗</Link></li>
        </ul>
      </Box>
    </SiteWrapper>
  )
}
