import React, { useEffect, useState } from 'react'
import { Alert } from 'src/components/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useQueryParams } from 'src/hooks'
import TextField from '@mui/material/TextField'
import { Button } from 'src/components/Button'
import { StyledButton } from 'src/components/Button/StyledButton'
import ReCAPTCHA from 'react-google-recaptcha'
import CheckIcon from '@mui/icons-material/Check'
import { updateQueryParams } from 'src/utils/updateQueryParams'
import { ClaimDateMessage } from 'src/pages/Airdrop/ClaimDateMessage'

const captchaSiteKey = '6LfOm4cfAAAAAJWnWkKuh2hS91sgMUZw0T3rvOsT'

type ActiveUserEligibility = {
  userId: string
  email: string
  prevAddress: string
  token: string
}

export function AuthereumVerified() {
  const { queryParams } = useQueryParams()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [userData, setUserData] = useState<ActiveUserEligibility>()
  const [captchaResponseToken, setCaptchaResponseToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const { email, userId, address: prevAddress, _token: token } = queryParams
    const data = {
      userId: userId as string,
      email: email as string,
      prevAddress: prevAddress as string,
      token: token as string,
    }
    setUserData(data)
    if (prevAddress) {
      setInputValue(prevAddress as string)
    }
  }, [queryParams])

  function handleInputChange(event: any) {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccessMsg('')
      const { userId, token } = userData as ActiveUserEligibility
      if (!(userData && userId)) {
        return
      }

      const url = 'https://authereum.hop.exchange/update-address'
      const _address = inputValue.trim()
      const data = { address: _address, userId, token, responseToken: captchaResponseToken }

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
      if (json.success) {
        setSuccessMsg(json.success)
        updateQueryParams({ address: _address })
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const onCaptchaChange = (value: string | null) => {
    setCaptchaResponseToken(value || '')
  }

  const isEligible = userData?.userId

  if (!isEligible) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center" textAlign="center">
        <Box my={3} maxWidth={[350, 400, 525]}>
          <Typography variant="h6">
            Sorry, the {userData?.email!} account is not eligible for the Hop airdrop
          </Typography>
        </Box>
        <Box my={3} display="flex" flexDirection="column" justifyContent="center">
          <StyledButton href={"/airdrop/authereum-verify"}>
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
        <Typography variant="h3">
          🥳
        </Typography>
        <Typography variant="h5">
          Congrats! You're eligible for the airdrop
        </Typography>
        <Typography variant="body1">
          Verified {userData?.email!} account <CheckIcon style={{ color: 'green' }} />
        </Typography>

        <Box mt={3}>
          <Typography variant="subtitle2">
            Eligible for 1,000 HOP
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle2">
            Enter an Ethereum address you want to claim the HOP tokens with.
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body1">
            Per the governance action, you will be able to claim your tokens shortly after this renewed claim period.
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="body1">
            Use an address that is <strong>not</strong> an Authereum address and do not input an address from an exchange. Exchanges will not support the claim process. Input an address that you control, such as your MetaMask address.
          </Typography>
        </Box>
      </Box>

      <ClaimDateMessage />

      <Box my={3} display="flex" flexDirection="column" justifyContent="center">
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0x123..."
        />

        <Box mt={2} my={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <ReCAPTCHA
            sitekey={captchaSiteKey}
            onChange={onCaptchaChange}
          />
        </Box>

        <Button loading={loading} disabled={submitDisabled} onClick={handleSubmit} variant="contained" color="primary" highlighted>
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
        <StyledButton href={"/airdrop/authereum"}>
          Go back
        </StyledButton>
      </Box>
    </Box>
  )
}
