import { FC } from 'react'
import styled from 'styled-components/macro'
import { shadow, ShadowProps } from 'styled-system'
import Button, { ButtonProps } from './Button'

export const StyledButton: FC<ShadowProps & ButtonProps> = styled(Button)`
  ${shadow}
`
