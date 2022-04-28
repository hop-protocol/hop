import React, { useCallback, useEffect, useState } from 'react'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useQueryParams } from 'src/hooks'
import { Input } from 'src/components/ui'
import Button from 'src/components/buttons/Button'
import { StyledButton } from 'src/components/buttons/StyledButton'
import ReCAPTCHA from 'react-google-recaptcha'
import CheckIcon from '@material-ui/icons/Check'

const captchaSiteKey = '6LfOm4cfAAAAAJWnWkKuh2hS91sgMUZw0T3rvOsT'

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
  const [userData, setUserData] = useState<ActiveUserEligibility>()
  const [captchaResponseToken, setCaptchaResponseToken] = useState<string>('')

  useEffect(() => {
    const { username, eligible, social, userId } = queryParams
    const data = {
      eligible: eligible === 'true',
      social: social as SocialMediaPlatform,
      userId: userId as string,
      username: username as string,
    }
    setUserData(data)
  }, [queryParams])

  function handleInputChange(event: any) {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      setError('')
      setSuccessMsg('')
      const { eligible, social, userId, username } = userData as ActiveUserEligibility
      if (!(userData && eligible && social && userId && username)) {
        return
      }

      const url = `https://social-auth.hop.exchange/${social}/update-address`
      const data = { address: inputValue, ...userData, responseToken: captchaResponseToken }

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
      setSuccessMsg('Successfully set address to use for airdrop. Keep an eye out for an official announcement from the Hop team on how to claim your tokens.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const onCaptchaChange = (value: string) => {
    setCaptchaResponseToken(value)
  }

  const isEligible = userData?.eligible

  if (!isEligible) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center" textAlign="center">
        <Box my={3} maxWidth={[350, 400, 525]}>
          <Typography variant="h6" color="textSecondary">
            Sorry, the {socialNames[userData?.social!]} account @{userData?.username!} is not eligible for the Hop airdrop
          </Typography>
        </Box>
        <Box my={3} display="flex" flexDirection="column" justifyContent="center">
          <StyledButton href={"/airdrop/social-verify"}>
            Go back
          </StyledButton>
        </Box>
      </Box>
    )
  }

  const submitDisabled = !(inputValue && captchaResponseToken)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center" textAlign="center">
      <Box my={3} maxWidth={[350, 400, 525]}>
        <Typography variant="h3" color="textSecondary">
          🥳
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Congrats! you're eligible for the airdrop
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Verified {socialNames[userData?.social!]} account @{userData?.username!} <CheckIcon style={{ color: 'green' }} />
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
          mb={2}
          fontSize={[0, 2]}
        />

        <Box my={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <ReCAPTCHA
            sitekey={captchaSiteKey}
            onChange={onCaptchaChange}
          />
        </Box>

        <Button disabled={submitDisabled} onClick={handleSubmit} variant="contained" color="primary" highlighted>
          Submit
        </Button>
      </Box>

      <Alert severity="error" onClose={() => setError('')}>
        {error}
      </Alert>
      <Alert severity="success" onClose={() => setSuccessMsg('')}>
        {successMsg}
      </Alert>

      <Box my={3} display="flex" flexDirection="column" justifyContent="center">
        <StyledButton href={"/airdrop/social-verify"}>
          Go back
        </StyledButton>
      </Box>
    </Box>
  )
}
