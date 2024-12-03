import React from 'react'

import {
  MantineProvider,
  DatesProvider,
  ModalsProvider,
  createEmotionCache,
} from '@teachfloor/ui-kit'

const emotionCache = createEmotionCache({ key: 'teachfloor' })

const theme = {
  /**
   * Defines color scheme for all components, defaults to "light"
   */
  colorScheme: 'light',

  /**
   * Controls focus ring styles:
   * - auto: display focus ring only when user navigates with keyboard (default)
   * - always: display focus ring when user navigates with keyboard and mouse
   * - never: focus ring is always hidden (not recommended)
   */
  focusRing: 'auto',

  /**
   * Determines whether motion based animations should be disabled for
   * users who prefer to reduce motion in their OS settings
   */
  respectReducedMotion: true,

  /**
   * Determines whether elements that do not have pointer cursor by default
   * (checkboxes, radio, native select) should have it.
   *
   * Default: 'default'
   */
  cursorType: 'pointer',

  /**
   * Default border-radius used for most elements
   * Possible values:
   * 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
   */
  defaultRadius: 6,

  /**
   * White and black colors, defaults to '#fff' and '#000'
   */
  white: '#FFF',
  black: '#333',

  /**
   * Object of arrays with 10 colors
   */
  colors: {
    brand: [
      "#C5DBFF",
      "#9CC2FF",
      "#76ABFF",
      "#5496FF",
      "#3683FF",
      "#1A72FF",
      "#0062FF",
      "#0058E6",
      "#004FCF",
      "#0047BA"
    ],
  },

  /**
   * Key of theme.colors
   */
  primaryColor: 'brand',

  /**
   * Index of color from theme.colors that is considered primary, Shade type is 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
   * Possible values:
   * Shade | { light: Shade; dark: Shade }
   */
  primaryShade: {
    light: 6,
    dark: 6
  },

  /**
   * Styles added to buttons with `:active` pseudo-class
   *
   * Defaut: { transform: translateY(1px); }
   */
  activeStyles: {
    transform: 'scale(0.98)',
  },
}

export const ThemeProvider = ({ children }) => (
  <MantineProvider
    theme={theme}
    emotionCache={emotionCache}
    withGlobalStyles
    withNormalizeCSS
  >
    <DatesProvider>
      <ModalsProvider>
        {children}
      </ModalsProvider>
    </DatesProvider>
  </MantineProvider>
)