import Box from '@mui/material/Box'
import React from 'react'
import { StyledButton } from '#components/Button/StyledButton.js'
import { StyledLink } from '#components/Link/StyledLink.js'
import { SvgImg } from '#components/ui/SvgImg.js'

interface ButtonLinkProps {
  href: string
  onClick?: () => void
  children?: any
  iconComponent?: any
  iconColor?: string
}

export function ButtonLink(props: ButtonLinkProps) {
  const { href, onClick, children, iconComponent, iconColor } = props

  return (
    <StyledLink href={href} underline="none" mt={3}>
      <StyledButton width="250px" bg="background.default" py={3} onClick={onClick}>
        <Box display="flex" alignItems="center">
          {iconComponent && <SvgImg mr={3} size={24} color={iconColor} component={iconComponent} />}
          <Box>{children}</Box>
        </Box>
      </StyledButton>
    </StyledLink>
  )
}
