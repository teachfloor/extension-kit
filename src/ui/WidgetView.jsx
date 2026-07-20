import React, { useRef } from 'react'
import { Box } from '../'

import { useEmitViewHeight } from '../hooks/useEmitViewHeight'

/**
 * Widget View
 *
 * Wrapper for widget-surface apps. Observes its own height and emits
 * it to the host over RPC so the dashboard widget slot fits the
 * content — no aspect ratio needed. Same mechanism `SettingsView`
 * uses for the app-settings page.
 *
 * Opt-in: widget authors who want auto-sizing wrap their content in
 * `<WidgetView>`. Apps that don't use it (or admins who explicitly
 * set an `aspect_ratio` option on the dashboard widget) get the
 * classic ratio-based sizing — the host prefers the admin's explicit
 * ratio over the app's suggested height.
 */
export const WidgetView = ({ children, ...props }) => {
  const ref = useRef(null)
  useEmitViewHeight(ref)

  return (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
}
