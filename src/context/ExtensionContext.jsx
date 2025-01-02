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
}

const ExtensionContext = createContext(defaultContext)

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
    if (!context.environment.initialized && !process.env.STORYBOOK) {
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