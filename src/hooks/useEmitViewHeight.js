import { useEffect } from 'react'

/**
 * Emit the observed element's `clientHeight` to the host over RPC as
 * `app.view.height` whenever it changes. The host uses this to size
 * the iframe container to fit the app's actual content — no aspect
 * ratio needed. Shared by `SettingsView` (page surface) and
 * `WidgetView` (widget surface). The emit is a no-op until the
 * `window.teachfloor` global is available (post-handshake).
 *
 * Uses `ResizeObserver`, so any layout change inside the observed
 * subtree — content load, state transitions, dynamic lists —
 * re-emits automatically. The host applies its own buffer/seed
 * behavior; the kit only reports the raw measurement.
 */
export const useEmitViewHeight = (ref) => {
  useEffect(() => {
    if (!ref.current) {
      return undefined
    }

    const observer = new ResizeObserver(() => {
      if (typeof teachfloor !== 'undefined' && teachfloor) {
        teachfloor.emit('app.view.height', ref.current?.clientHeight)
      }
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
}
