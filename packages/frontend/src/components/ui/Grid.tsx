import { FC } from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components'

interface CustomProps {
  gap?: number
  fullWidth?: boolean

  justifyCenter?: boolean
  justifyEnd?: boolean
  justifyStretch?: boolean
  alignCenter?: boolean
  alignEnd?: boolean
  alignStart?: boolean
}

type Props = CustomProps & ComposedStyleProps

const Grid: FC<Props> = styled.div<Props>`
  display: grid;

  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ fullWidth }) => fullWidth && 'width: 100%'};

  justify-items: ${props => {
    if (props.justifyItems) return props.justifyItems
    if (props.justifyCenter) return 'center'
    if (props.justifyEnd) return 'end'
    if (props.justifyStretch) return 'stretch'
    return 'start'
  }};
  align-items: ${props => {
    if (props.alignItems) return props.alignItems
    if (props.alignCenter) return 'center'
    if (props.alignEnd) return 'end'
    return 'start'
  }};

  & > div {
    border: 1px solid red;
  }

  ${composedStyleFns}
`

export { Grid }
