import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import { initialize } from '../'
import { ThemeProvider } from './ThemeProvider'

/**
 * Default context object
 */
const defaultContext = {
  userContext: undefined,
  appContext: undefined,
  environment: {
    initialized: false,
    viewport: undefined,
    path: undefined,
  },
  /**
   * Mirrors the dashboard's Mantine theme — color scheme + brand
   * palette. Apps don't need to read this for visuals; the kit's
   * `ThemeProvider` forwards it to MantineProvider so `theme.colorScheme`
   * and `theme.colors.brand[…]` references inside `sx={...}` callbacks
   * just work. Exposed in context for apps that need to render their
   * own non-Mantine UI.
   */
  theme: {
    colorScheme: 'light',
    colors: {
      brand: undefined,
    },
  },
}

export const ExtensionContext = createContext(defaultContext)

/**
 * Extension Context Provider
 */
export const ExtensionContextProvider = ({ autoInit = true, children }) => {
  const [context, setContext] = useState(defaultContext);

  /**
   * When teachfloor SDK is initialized:
   * - Start listening to event "__set_context"
   * - Update context state value
   * - Let the parent know the app is initialized by calling `initialize`
   */
  useEffect(() => {
    const tf = window.tf

    if (tf) {
      tf('onInit', (API) => {
        window.teachfloor = API

        window.teachfloor.on('__set_context', (context) => {
          setContext(context)
        })

        if (autoInit) {
          initialize()
        }
      })
    }
  }, [])

  const renderChildren = () => {
    if (typeof process !== 'undefined' && process.env?.STORYBOOK) {
      return children
    }

    if (!context.environment.initialized) {
      return null
    }

    return children
  }

  return (
    <ExtensionContext.Provider value={context}>
      <ThemeProvider>
        {renderChildren()}
      </ThemeProvider>
    </ExtensionContext.Provider>
  );
}

/**
 * Extension context hook
 */
export const useExtensionContext = () => {
  const context = useContext(ExtensionContext);

  if (!context) {
    throw new Error('useExtensionContext must be used within ExtensionContextProvider');
  }

  return context;
};