import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import mmIcon from 'src/assets/logos/metamask.svg'
import { Button } from 'src/components/Button'
import { ButtonLink } from 'src/components/Button/ButtonLink'
import { Icon } from 'src/components/ui/Icon'
import discordIcon from 'src/assets/logos/discord.svg'
import twitterIcon from 'src/assets/logos/twitter.svg'
import { useAddTokenToMetamask } from 'src/hooks'
import { useWindowSize } from 'usehooks-ts'

export function Claimed() {
  const { width, height } = useWindowSize()
  const { addHopToken } = useAddTokenToMetamask()

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
      <Box my={3} textAlign="center">
        <Typography variant="h3">
          🥳
        </Typography>
        <Typography variant="h5">
          Successfully claimed HOP
        </Typography>
      </Box>
      <Box mt={1} mb={5}>
        <Button onClick={addHopToken}>
          <Box mr={2}>
            Add Hop Token to MetaMask
          </Box>
          <Icon src={mmIcon} width={40} />
        </Button>
      </Box>
      <Box mb={2} textAlign="center">
        <Typography variant="body1">
          We encourage you to share on Twitter and join the Hop Discord to get involved in governance.
        </Typography>
      </Box>

      <Box mb={3}>
        <ButtonLink
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just claimed my $HOP tokens from @HopProtocol! 🥳')}`}
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
    </Box>
  )
}
