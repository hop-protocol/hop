import React, { useCallback, useEffect, useState } from 'react'
import { utils } from 'ethers'
import Alert from 'src/components/alert/Alert'
import { Div, Flex, Input, StyledTypography } from 'src/components/ui'
import { useQueryParams } from 'src/hooks'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { logError } from 'src/logger/logger'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
}

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export const jsonCorsHeaders = {
  ...corsHeaders,
  ...jsonHeaders,
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
  const [inputDisabled, setInputDisabled] = useState()
  const [error, setError] = useState<string | null>(null)
  const [socialMedia, setSocialMedia] = useState<ActiveUserEligibility>()

  useEffect(() => {
    console.log(`queryParams:`, queryParams)
    const { username, eligible, social, userId } = queryParams

    const sm = {
      eligible: Boolean(eligible),
      social: social as SocialMediaPlatform,
      userId: userId as string,
      username: username as string,
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
          setInputValue(validAddress || '')
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

    const validAddress = validateAddress(inputValue)

    const { eligible, social, userId, username } = socialMedia as ActiveUserEligibility
    if (!(socialMedia && eligible && social && userId && username && validAddress)) {
      return
    }

    const url = `https://social-auth.hop.exchange/${social}/update-address`
    const data = { address: validAddress, ...socialMedia }

    const res = await fetch(url, {
      method: 'POST',
      headers: jsonCorsHeaders,
      body: JSON.stringify(data),
    })
      .then(res => res.blob())
      .catch(logError)

    console.log(`res:`, res)
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
          value={inputValue || ''}
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
