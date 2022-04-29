import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Alert from 'src/components/alert/Alert'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { DiscordLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { Input } from 'src/components/ui'
import ReCAPTCHA from 'react-google-recaptcha'
import Button from 'src/components/buttons/Button'

const captchaSiteKey = '6LfOm4cfAAAAAJWnWkKuh2hS91sgMUZw0T3rvOsT'

export function AuthereumVerify() {
  const [inputValue, setInputValue] = useState('')
  const [captchaResponseToken, setCaptchaResponseToken] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  function handleInputChange(event: any) {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      setError('')
      setSuccessMsg('')
      const url = `https://authereum.hop.exchange/check-email`
      const data = { email: inputValue, responseToken: captchaResponseToken }

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

      setSuccessMsg('A confirmation email has been sent.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const onCaptchaChange = (value: string) => {
    setCaptchaResponseToken(value)
  }

  const submitDisabled = !(inputValue && captchaResponseToken)

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box m={2} textAlign="center">
        <Typography variant="h5" component="div">
          Hop Airdrop for Authereum Users
        </Typography>
      </Box>
      <Box m={3} maxWidth={500} textAlign="center">
        <Typography variant="subtitle2" color="textSecondary">
          Check if your Authereum account is eligible for the <strong>Authereum User</strong> airdrop
        </Typography>
      </Box>
      <Box my={3} display="flex" flexDirection="column" justifyContent="center">
        <Input
          width={[320, 420]}
          maxWidth={['auto']}
          value={inputValue}
          onChange={handleInputChange}
          label="Authereum Email"
          placeholder="alice@example.com"
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
        <StyledButton href={"/airdrop/preview"}>
          Go back
        </StyledButton>
      </Box>
    </Box>
  )
}
