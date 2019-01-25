// https://www.styled-components.com/docs/api#typescript

import React from 'react'
import * as styledComponents from 'styled-components'
import { Palette, themeColors } from './theme-colors'

export interface Theme {
  colors: Palette
  fontFamily: string
  radius: number
  spacing: number
}

export type ThemedProps<V> = styledComponents.ThemedStyledProps<
  React.HTMLProps<V>,
  Theme
>

export const theme: Theme = {
  colors: themeColors,
  // tslint:disable-next-line:max-line-length
  fontFamily: `'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  radius: 8,
  spacing: 8,
}

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider: StyledThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>

export const ThemeProvider: React.FunctionComponent<{
  children: React.ReactChild
}> = props => (
  <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
)

export { css, styled }

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }
`
