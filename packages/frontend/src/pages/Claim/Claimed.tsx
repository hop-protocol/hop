import React from 'react'
import { Div, Flex, Icon, SvgImg, Text } from 'src/components/ui'
import { useAddTokenToMetamask } from 'src/hooks'
import mmIcon from 'src/assets/logos/metamask.svg'
import { ReactComponent as twitterIcon } from 'src/assets/logos/twitter.svg'
import { ReactComponent as discordIcon } from 'src/assets/logos/discord.svg'
import { StyledButton } from 'src/components/buttons/StyledButton'

export function Claimed() {
  const { addHopToken } = useAddTokenToMetamask()

  return (
    <Flex column justifyCenter alignCenter>
      <Text my={3} fontSize={2} textAlign="left" secondary>
        Congratulations on claiming you HOP! We encourage you to share on Twitter and join the Hop
        Discord to get involved in governance
      </Text>

      <StyledButton
        width="250px"
        bg="background.default"
        py={3}
        flat
        onClick={() => console.log('share twitter')}
      >
        <Flex alignCenter>
          <SvgImg mr={3} size={24} color="#00A2F5" component={twitterIcon} />
          <Div>Share on Twitter</Div>
        </Flex>
      </StyledButton>

      <StyledButton
        mt={3}
        width="250px"
        bg="background.default"
        py={3}
        flat
        onClick={() => console.log('share discord')}
      >
        <Flex alignCenter>
          <SvgImg mr={3} size={24} color="#7289DA" component={discordIcon} />
          <Div>Join the Discord</Div>
        </Flex>
      </StyledButton>

      <StyledButton bg="background.default" py={3} mt={3} flat onClick={addHopToken}>
        <Div mr={2}>Add Hop Token to MetaMask</Div>
        <Icon src={mmIcon} width={40} />
      </StyledButton>
    </Flex>
  )
}
