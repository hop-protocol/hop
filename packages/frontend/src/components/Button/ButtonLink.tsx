import React from 'react'
import { StyledButton } from 'src/components/Button/StyledButton'
import { SvgImg } from 'src/components/ui/SvgImg'
import { StyledLink } from 'src/components/Link/StyledLink'
import Box from '@material-ui/core/Box'

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
