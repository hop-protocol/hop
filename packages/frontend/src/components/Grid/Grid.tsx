import styled from 'styled-components'
import { ComposedStyleProps, composedStyleFns } from '#utils/index.js'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  ${composedStyleFns}
`

export const GridRow = styled(GridContainer)<ComposedStyleProps & { hover?: boolean }>`
  &:hover {
    background-color: ${({ hover, theme }) => hover && theme.colors.action.hover};
  }
`
