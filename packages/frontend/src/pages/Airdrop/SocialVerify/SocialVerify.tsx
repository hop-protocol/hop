import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { DiscordLoginButton, TwitterLoginButton } from "react-social-login-buttons";

export function SocialVerify() {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box m={2} textAlign="center">
        <Typography variant="h5" component="div">
          Hop Airdrop Social Verification
        </Typography>
      </Box>
      <Box m={3} maxWidth={500} textAlign="center">
        <Typography variant="body1">
          The top 500 Hop Discord participants and 79 Twitter users who were early evangelists for Hop are eligible for these claims.
        </Typography>
      </Box>
      <Box marginBottom={4} m={3} maxWidth={600} textAlign="center">
        <Typography variant="body1">
          Please login with Discord or Twitter to verify your eligibility for the <strong>Active User</strong> airdrop
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box m={0} maxWidth={250}>
          <DiscordLoginButton onClick={() => {
            window.location.href = "https://social-auth.hop.exchange/discord/oauth"
            }} />
        </Box>
        <Box m={2} maxWidth={250}>
          <TwitterLoginButton onClick={() => {
            window.location.href = "https://social-auth.hop.exchange/twitter/oauth"
            }} />
        </Box>
        <Box marginBottom={4} m={3} maxWidth={500} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            <em>We only require your username and user ID from the social media platforms for verification. Unfortunately the minimum permissions scope for Twitter ask for additional data, which we don't need or use. We don't store any user information.</em>
          </Typography>
        </Box>
      </Box>
      <Box my={3} display="flex" flexDirection="column" justifyContent="center">
        <StyledButton href={"/airdrop/preview"}>
          Go back
        </StyledButton>
      </Box>
    </Box>
  )
}
