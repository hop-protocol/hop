import React, { useEffect, useState } from 'react'
import Alert from 'src/components/alert/Alert'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { ExternalLink } from 'src/components/Link'
import { Div, Flex, StyledTypography } from 'src/components/ui'

export function ActiveUser() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSocialAuth() {
      const url = ``
      await fetch(url)
    }
    fetchSocialAuth()
  }, [])

  async function handleDiscord() {}

  async function handleTwitter() {}

  return (
    <Flex column alignCenter textAlign="center">
      <Div my={3} maxWidth={[350, 400, 525]}>
        <StyledTypography style={{ marginTop: '1rem' }} variant="subtitle2" color="textSecondary">
          Please login with Discord or Twitter to verify your eligibility for the <b>Active User</b>
          &nbsp;airdrop tokens
        </StyledTypography>
      </Div>

      <Flex justifyCenter>
        <Div mx={3}>
          <ExternalLink href="https://social-auth.hop.exchange/discord/oauth">
            <StyledButton bg="#5865F2 !important" onClick={handleDiscord}>
              <Div color="white"></Div>
              Discord
            </StyledButton>
          </ExternalLink>
        </Div>

        <Div mx={3} color="white">
          <ExternalLink href="https://social-auth.hop.exchange/twitter/oauth">
            <StyledButton color="inherit" bg="#0083eb !important" onClick={handleTwitter}>
              <Div color="white"></Div>
              Twitter
            </StyledButton>
          </ExternalLink>
        </Div>
      </Flex>

      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    </Flex>
  )
}
