import React from 'react'
import { Circle, Div, Flex, Icon, Text } from 'src/components/ui'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { Delegate } from './useClaim'

const delegates: Delegate[] = [
  {
    ensName: 'vitalik.eth',
    address: '0xb7E22bdDEC43A7bC82C052c3C849D5d5fDC5afAa',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'satoshi.eth',
    address: '0xC35F4C7370C3efDFa628EF351f3ec822CaD47b65',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'chris.eth',
    address: '0xD41732398f566F67E942aF72315457c89A077f5C',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'shane.eth',
    address: '0xD8D60a885F0635E65363Cf4e7DeCD2fA39984A05',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'miguel.eth',
    address: '0x3EAa33f296C10aca61206B28fb7DFeEcf7C4489C',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'lito.eth',
    address: '0x79dF6c3E2959D57BbaDF4d9925Ae0caE6B5106DE',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'isaac.eth',
    address: '0x537c37b51707BD91f09555F68790562760B2C716',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'ricmoo.eth',
    address: '0x5555763613a12D8F3e73be831DFf8598089d3dCa',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
  {
    ensName: 'lordlubin.eth',
    address: '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69',
    votes: 454,
    avatar: 'https://ethereum.foundation/static/51eeee937f5fca4d8e2fbb032614f05a/6dea1/vitalik.png',
  },
]

export function ChooseDelegate(props) {
  const { delegate, selectDelegate, inputValue, setInputValue } = props
  const { theme } = useThemeMode()

  function handleSelectDelegate(del: Delegate) {
    if (inputValue) {
      setInputValue('')
    }
    if (del?.ensName === delegate?.ensName) {
      return selectDelegate()
    }
    selectDelegate(del)
  }

  return (
    <Div>
      <Text my={3} fontSize={2} textAlign="left" secondary>
        Select a community member to represent you. You can change this at any time. Click on the
        💬&nbsp; icon to read their application.
      </Text>
      <Text fontSize={2} textAlign="left" secondary>
        You can delegate to someone not listed, or to yourself, by entering an ENS name or Ethereum
        address with the button on the right.
      </Text>

      <Flex my={4} $wrap justifyAround>
        {delegates.map((del: Delegate, i) => (
          <Flex
            key={del.address + i}
            py={1}
            px={3}
            my={2}
            mx={1}
            justifyBetween
            alignCenter
            bg="background.contrast"
            borderRadius={'25px'}
            boxShadow={'0px 4px 25px 10px rgba(255, 255, 255, 0.01)'}
            width={[300, 300]}
            onClick={() => handleSelectDelegate(del)}
            maxWidth={[275, 325]}
            pointer
            border={
              delegate?.ensName! === del?.ensName
                ? `1.5px solid ${(theme as any).palette.primary.main}`
                : '1.5px solid transparent'
            }
          >
            <Flex alignCenter>
              <Circle mr={1}>
                <Icon src={del.avatar} width={45} />
              </Circle>
              <Div ml={2} p={2}>
                <Div color="text.primary">{del.ensName}</Div>
                <Div color="text.secondary">{del.votes}</Div>
              </Div>
            </Flex>
            <Div fontSize={20}>💬</Div>
          </Flex>
        ))}
      </Flex>
    </Div>
  )
}
