import React from 'react'
import { StyledButton } from '../buttons/StyledButton'
import { Div, Flex, SvgImg } from '../ui'
import { StyledLink } from '../ui/StyledLink'

interface ButtonLinkProps {
  href: string
  onClick: () => void
  children?: any
  iconComponent?: any
  iconColor?: string
}

export function ButtonLink(props: ButtonLinkProps) {
  const { href, onClick, children, iconComponent, iconColor } = props

  return (
    <StyledLink href={href} underline="none" mt={3}>
      <StyledButton width="250px" bg="background.default" py={3} flat onClick={onClick}>
        <Flex alignCenter>
          {iconComponent && <SvgImg mr={3} size={24} color={iconColor} component={iconComponent} />}
          <Div>{children}</Div>
        </Flex>
      </StyledButton>
    </StyledLink>
  )
}
