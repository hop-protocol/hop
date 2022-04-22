import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { utils } from 'ethers'
import Alert from 'src/components/alert/Alert'
import LargeTextField from 'src/components/LargeTextField'
import { Div, Flex, Input, StyledTypography } from 'src/components/ui'
import { useQueryParams } from 'src/hooks'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { Typography } from '@material-ui/core'

type SocialMedia = {
  social: 'twitter' | 'discord'
  username: string
  eligible: boolean
  userId: string
}

export function SocialVerified() {
  const { queryParams } = useQueryParams()
  const [inputValue, setInputValue] = useState('')
  const [inputDisabled, setInputDisabled] = useState()
  const [error, setError] = useState<string | null>(null)
  const [socialMedia, setSocialMedia] = useState<SocialMedia>()

  useEffect(() => {
    console.log(`queryParams:`, queryParams)
    const { username, eligible, social, userId } = queryParams
    const sm = {
      social: social as 'twitter' | 'discord',
      username: username as string,
      eligible: Boolean(eligible),
      userId: userId as string,
    }
    setSocialMedia(sm)
  }, [queryParams])

  function validateAddress(input: string) {
    try {
      const addr = utils.getAddress(input.toLowerCase())
      if (addr) {
        return addr
      }
      return false
    } catch (error: any) {
      setError(error.message)
    }
  }

  function handleInputChange(e) {
    if (e.target.value) {
      setError(null)
      try {
        const validAddress = validateAddress(e.target.value)
        if (validAddress) {
          setInputValue(validAddress)
        }
      } catch (error: any) {
        setError(error.message)
      }
    } else {
      setInputValue('')
    }
  }

  const handleSubmit = useCallback(async () => {
    console.log(`inputValue:`, inputValue)
    console.log(`socialMedia:`, socialMedia)

    if (!(socialMedia?.eligible && socialMedia.userId && inputValue)) {
      return
    }

    const url = `https://social-auth.hop.exchange/${socialMedia?.social}/update-address`
    const validAddress = validateAddress(inputValue)
    const data = { userId: socialMedia.userId, address: validAddress }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const json = await res.json()
    console.log(`json:`, json)
  }, [inputValue, socialMedia])

  return (
    <Flex column alignCenter textAlign="center">
      <Div my={3} maxWidth={[350, 400, 525]}>
        <StyledTypography variant="h6" color="textSecondary">
          Thank you for verifying your {socialMedia?.social} account for us!
        </StyledTypography>

        <StyledTypography style={{ marginTop: '3rem' }} variant="subtitle2" color="textSecondary">
          Please enter an Ethereum Mainnet address that you control to claim your <b>Active User</b>
          &nbsp;airdrop tokens on [DATE]
        </StyledTypography>
      </Div>

      <Flex my={3} column alignCenter fullWidth>
        <Input
          width={[320, 420]}
          maxWidth={['auto']}
          value={inputValue}
          onChange={handleInputChange}
          disabled={inputDisabled}
          placeholder="Enter address"
          mb={4}
          fontSize={[0, 2]}
        />

        <StyledButton disabled={!(inputValue && socialMedia?.eligible)} onClick={handleSubmit}>
          Submit
        </StyledButton>
      </Flex>

      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    </Flex>
  )
}
