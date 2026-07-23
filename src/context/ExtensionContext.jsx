import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import { initialize } from '../'
import { SURFACES } from '../constants'
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

    /**
     * Rendering shape the app is currently mounted in — `drawer` (the
     * right-side overlay panel), `page` (inline inside a host page
     * container, e.g. the app-detail settings page), or `widget` (a
     * cell in the dashboard widget grid). Defaults to `'drawer'` for
     * backward compatibility with hosts that predate the surface signal.
     *
     * Grouped inside `environment` alongside `viewport` + `path`
     * because it describes where/how the app is currently living, not
     * what it IS (that's `appContext`).
     *
     * Apps can adapt layout by reading this: compact rendering for
     * widgets, full layout for drawers, form-heavy for settings pages.
     * Use the exported `SURFACES` constant for comparisons rather than
     * bare strings.
     */
    surface: SURFACES.DRAWER,

    /**
     * How the current surface is being presented — `'default'` (the
     * natural placement: widget slot on the dashboard, drawer panel,
     * settings page) or `'modal'` (a widget-surface view that was
     * opened via `openModal(...)` from the same widget). Widgets can
     * check this to relax compact layouts when they've been given
     * more room.
     *
     * Only ever set to `'modal'` for widget surface today; drawer and
     * page surfaces always report `'default'`.
     */
    presentation: 'default',
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

  /**
   * Arbitrary app-passed payload that carried this iframe into its
   * current mount — e.g. `openModal({ state: { noteId } })` from a
   * parent widget lands here in the modal-mounted child. Set once at
   * mount, does not update. Same pattern as React Router's
   * `location.state`. `null` when no launch state was passed.
   *
   * Top-level (not under `environment`) because it's APP-provided
   * data, not host/URL-derived context — mirrors how React Router
   * puts host-driven `pathname` and app-driven `state` at the same
   * level of `location`.
   *
   * Prefer the `useLaunchState()` hook at call sites to keep the
   * variable name unambiguous next to React's `useState` locals.
   */
  state: null,
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