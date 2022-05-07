import React, { useEffect, useState } from 'react'
import { Div, Flex, Icon, Text } from 'src/components/ui'
import { useAddTokenToMetamask } from 'src/hooks'
import mmIcon from 'src/assets/logos/metamask.svg'
import { ReactComponent as twitterIcon } from 'src/assets/logos/twitter.svg'
import { ReactComponent as discordIcon } from 'src/assets/logos/discord.svg'
import Button from 'src/components/buttons/Button'
import { ButtonLink } from 'src/components/Button'
import Box from '@material-ui/core/Box'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

export function Claimed() {
  const { width, height } = useWindowSize()
  const { addHopToken } = useAddTokenToMetamask()
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  useEffect(() => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
    }, 7 * 1000)
  }, [])

  return (
    <Flex column justifyCenter alignCenter>
      <Text my={3} fontSize={2} textAlign="center" secondary>
        Congratulations on claiming you HOP!
      </Text>
      <Text my={3} fontSize={2} textAlign="center" secondary>
        We encourage you to share on Twitter and join the Hop Discord to get involved in governance
      </Text>

      <Box mt={3} mb={3}>
        <ButtonLink
          href={"https://twitter.com/intent/tweet?text=TODO"}
          iconColor="#00A2F5"
          iconComponent={twitterIcon}
        >
          Share on Twitter
        </ButtonLink>
      </Box>

      <Box mb={3}>
        <ButtonLink
          href="https://discord.com/invite/PwCF88emV4"
          iconColor="#7289DA"
          iconComponent={discordIcon}
        >
          Join the Discord
        </ButtonLink>
      </Box>

      <Box mt={3}>
        <Button onClick={addHopToken}>
          <Div mr={2}>Add Hop Token to MetaMask</Div>
          <Icon src={mmIcon} width={40} />
        </Button>
      </Box>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
        />
      )}
    </Flex>
  )
}
