import React, { useCallback, useEffect, useState } from 'react'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { useQueryParams } from 'src/hooks'
import { Input } from 'src/components/ui'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { logError } from 'src/logger/logger'

const socialNames = {
  twitter: 'Twitter',
  discord: 'Discord',
}

type SocialMediaPlatform = 'twitter' | 'discord'

type ActiveUserEligibility = {
  eligible: boolean
  social: SocialMediaPlatform
  userId: string
  username: string
}

export function SocialVerified() {
  const { queryParams } = useQueryParams()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [socialMedia, setSocialMedia] = useState<ActiveUserEligibility>()

  useEffect(() => {
    console.log(`queryParams:`, queryParams)
    const { username, eligible, social, userId } = queryParams

    const sm = {
      eligible: eligible === 'true',
      social: social as SocialMediaPlatform,
      userId: userId as string,
      username: username as string,
    }

    setSocialMedia(sm)
  }, [queryParams])

  function handleInputChange(event: any) {
    setInputValue(event.target.value)
  }

  const handleSubmit = useCallback(async () => {
    try {
      setError('')
      setSuccessMsg('')
      const { eligible, social, userId, username } = socialMedia as ActiveUserEligibility
      if (!(socialMedia && eligible && social && userId && username)) {
        return
      }

      const url = `https://social-auth.hop.exchange/${social}/update-address`
      const data = { address: inputValue, ...socialMedia }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (json.error) {
        throw new Error(json.error)
      }
      setSuccessMsg('Successfully set address to use for airdrop')
    } catch (err: any) {
      setError(err.message)
    }
  }, [inputValue, socialMedia])

  const isEligible = socialMedia?.eligible

  if (!isEligible) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center" textAlign="center">
        <Box my={3} maxWidth={[350, 400, 525]}>
          <Typography variant="h6" color="textSecondary">
            Sorry, the {socialNames[socialMedia?.social!]} account @{socialMedia?.username!} is not eligible for the Hop airdrop
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center" textAlign="center">
      <Box my={3} maxWidth={[350, 400, 525]}>
        <Typography variant="h6" color="textSecondary">
          Thank you for verifying your {socialNames[socialMedia?.social!]} account @{socialMedia?.username!}
        </Typography>

        <Typography style={{ marginTop: '3rem' }} variant="subtitle2" color="textSecondary">
          Please enter an Ethereum Mainnet address that you control to claim your <b>Active User</b>
          &nbsp;airdrop tokens on [DATE]
        </Typography>
      </Box>

      <Box my={3} display="flex" flexDirection="column" justifyContent="center">
        <Input
          width={[320, 420]}
          maxWidth={['auto']}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0x123..."
          mb={4}
          fontSize={[0, 2]}
        />

        <StyledButton disabled={!inputValue} onClick={handleSubmit}>
          Submit
        </StyledButton>
      </Box>

      <Alert severity="error" onClose={() => setError('')}>
        {error}
      </Alert>
      <Alert severity="success" onClose={() => setSuccessMsg('')}>
        {successMsg}
      </Alert>
    </Box>
  )
}
