import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'

export const composedStyleFns = () =>
  compose(space, color, layout, typography, border, background, shadow, position, flexbox)

export type ComposedStyleProps = BackgroundProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  PositionProps &
  ShadowProps &
  TypographyProps &
  SpaceProps

export function squareDimensions({ size }: { size?: number | string }) {
  if (!size) {
    size = 24
  }
  return `width: ${size}px; height: ${size}px;`
}
