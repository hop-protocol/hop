import React from 'react'
import { Div, Flex, Icon, Text } from 'src/components/ui'
import { useAddTokenToMetamask } from 'src/hooks'
import mmIcon from 'src/assets/logos/metamask.svg'
import { ReactComponent as twitterIcon } from 'src/assets/logos/twitter.svg'
import { ReactComponent as discordIcon } from 'src/assets/logos/discord.svg'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { ButtonLink } from 'src/components/Button'

export function Claimed() {
  const { addHopToken } = useAddTokenToMetamask()

  return (
    <Flex column justifyCenter alignCenter>
      <Text my={3} fontSize={2} textAlign="left" secondary>
        Congratulations on claiming you HOP! We encourage you to share on Twitter and join the Hop
        Discord to get involved in governance
      </Text>

      <ButtonLink
        href="https://discord.com/invite/PwCF88emV4"
        onClick={() => console.log('share twitter')}
        iconColor="#00A2F5"
        iconComponent={twitterIcon}
      >
        Share on Twitter
      </ButtonLink>

      <ButtonLink
        href="https://discord.com/invite/PwCF88emV4"
        onClick={() => console.log('share discord')}
        iconColor="#7289DA"
        iconComponent={discordIcon}
      >
        Join the Discord
      </ButtonLink>

      <StyledButton bg="background.default" py={3} mt={3} flat onClick={addHopToken}>
        <Div mr={2}>Add Hop Token to MetaMask</Div>
        <Icon src={mmIcon} width={40} />
      </StyledButton>
    </Flex>
  )
}
