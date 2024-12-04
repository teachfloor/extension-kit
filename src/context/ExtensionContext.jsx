import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import { ThemeProvider } from './ThemeProvider'

/**
 * Default context object
 */
const defaultContext = {
  userContext: undefined,
  appContext: undefined,
  environment: {
    viewport: undefined,
  },
}

const ExtensionContext = createContext(defaultContext)

/**
 * Extension Context Provider
 */
export const ExtensionContextProvider = ({ children }) => {
  const [context, setContext] = useState(defaultContext);

  /**
   * When teachfloor SDK is initialized:
   * - Start listening to event "__set_context"
   * - Update context state value
   */
  useEffect(() => {
    const tf = window.tf

    if (tf) {
      tf('onInit', (API) => {
        window.teachfloor = API

        window.teachfloor.on('__set_context', (context) => {
          setContext(context)
        })
      })
    }
  }, [])

  return (
    <ExtensionContext.Provider value={context}>
      <ThemeProvider>
        {children}
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