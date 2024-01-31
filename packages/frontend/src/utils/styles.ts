import {
  BackgroundProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  GridProps,
  LayoutProps,
  PositionProps,
  ShadowProps,
  SpaceProps,
  TypographyProps,
  background,
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
} from 'styled-system'

export const composedStyleFns = () =>
  compose(space, color, layout, typography, border, background, shadow, position, flexbox, grid)

export type ComposedStyleProps = BackgroundProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  PositionProps &
  ShadowProps &
  TypographyProps &
  SpaceProps &
  GridProps

export interface SquareDimensions {
  size?: number | string
  width?: number | string
}

export function squareDimensions({ size = 24, width }: SquareDimensions) {
  if (width) {
    size = width
  }

  return `width: ${size}px; height: ${size}px;`
}
