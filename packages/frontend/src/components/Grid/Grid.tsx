import styled from 'styled-components/macro'
import { ComposedStyleProps, composedStyleFns } from 'src/utils'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  ${composedStyleFns}
`

export const GridRow = styled(GridContainer)<ComposedStyleProps & { hover?: boolean }>`
  &:hover {
    background-color: ${({ hover, theme }) => hover && theme.colors.action.hover};
  }
`
