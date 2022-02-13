import React from 'react'
import { Link } from 'src/components/Link'
import { Circle, Div, Flex, Icon, Text } from 'src/components/ui'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { delegates } from './data'
import { Delegate } from './useClaim'

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
            maxWidth={[275, 325]}
            pointer
            border={
              delegate?.ensName! === del?.ensName
                ? `1.5px solid ${(theme as any).palette.primary.main}`
                : '1.5px solid transparent'
            }
          >
            <Flex fullWidth alignCenter onClick={() => handleSelectDelegate(del)}>
              <Circle mr={1}>
                <Icon src={del.avatar} width={45} />
              </Circle>
              <Div ml={2} p={2}>
                <Div color="text.primary">{del.ensName}</Div>
                <Div color="text.secondary">{del.votes}</Div>
              </Div>
            </Flex>
            <Div fontSize={20}>
              <Link
                underline="none"
                target="_blank"
                href={`https://forum.hop.exchange/t/community-governance-process/30`}
              >
                💬
              </Link>
            </Div>
          </Flex>
        ))}
      </Flex>
    </Div>
  )
}
