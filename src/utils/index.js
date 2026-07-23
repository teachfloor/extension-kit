export const initialize = () => {
  if (!teachfloor) {
    throw new Error('Error initializing app')
  }

  teachfloor.emit('app.initialized')
}

export const showToast = (message = null, options = {}) => {
  if (!teachfloor || !message) {
    return
  }

  teachfloor.emit('ui.toast.show', { message, ...options })
}

export const showDrawer = () => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('ui.drawer.show')
}

export const hideDrawer = () => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('ui.drawer.hide')
}

export const toggleDrawer = () => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('ui.drawer.toggle')
}

/**
 * Promote the CALLING widget into a modal container. The widget's own
 * component runs unchanged, just with more room. The kit deliberately
 * does NOT accept a widget identifier — the modal always renders the
 * SAME widget that called `openModal()`, never a different widget from
 * the same app. Keeps the trust model tight: a widget can expand itself,
 * not force another widget to appear.
 *
 * Optional `state` is an arbitrary app-defined payload the caller can
 * pass; the modal-hosted iframe reads it via `useLaunchState()` (or
 * `useExtensionContext().state`). Set once at mount and does not
 * update — think of it like React Router's `location.state`. Use it
 * for deep-linking / initial-form-values / opener context.
 *
 * Inside the modal-hosted iframe,
 * `useExtensionContext().environment.presentation` reads `'modal'`
 * (vs. the default `'default'`), so the widget can optionally adapt
 * its layout and can call `closeModal()` to dismiss itself.
 *
 * Modal has a clean two-state lifecycle (open/close) — hence the
 * `openModal` / `closeModal` verb pair here, distinct from drawer's
 * three-state `showDrawer` / `hideDrawer` / `toggleDrawer` family.
 *
 * Only meaningful when called from a widget-surface view. Calls from
 * drawer / page surfaces are silently ignored by the host (drawer/page
 * already have space, no promotion path).
 *
 * Kit spreads the whole `args` object into the emit payload — the host
 * validates + allow-lists each field (see `useAppModal` in
 * `ModalWrapper.jsx`). Same pattern as `showToast`.
 *
 * @param {object} [args]
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'100%'} [args.size='md']
 *                                                  Mantine modal size.
 * @param {boolean} [args.closeOnClickOutside=true]
 * @param {boolean} [args.closeOnEscape=true]
 * @param {object}  [args.state]                    Arbitrary launch state
 *                                                  the modal iframe reads
 *                                                  via `useLaunchState()`.
 */
export const openModal = (args = {}) => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('ui.modal.open', { ...args })
}

/**
 * Programmatically dismiss the currently-open modal. Only meaningful
 * when called from inside a modal-hosted iframe (i.e.
 * `useExtensionContext().environment.presentation === 'modal'`) — the
 * host wires the listener on the modal iframe's RPC connection, not
 * the widget slot's. Calls from outside a modal are silent no-ops.
 *
 * Typical use: a form submits successfully → the widget calls
 * `closeModal()` to tear down its own modal. Or a wizard finishes.
 */
export const closeModal = () => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('ui.modal.close')
}

export const goToViewport = (viewport = null) => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('request.viewport.change', viewport)
}

export const goToPath = (path = null) => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('request.path.change', path)
}

export const subscribeToEvent = (event, callback = () => { }) => {
  if (!teachfloor) {
    return
  }

  return teachfloor.on(event, callback)
}

export const retrieve = (key, source = 'appdata') => {
  if (!teachfloor) {
    return Promise.reject(new Error('Teachfloor is not available'))
  }

  return teachfloor.get(key, source)
}

export const store = (key, value, source = 'appdata') => {
  if (!teachfloor) {
    return Promise.reject(new Error('Teachfloor is not available'))
  }

  return teachfloor.set(key, value, source)
}

export const generate = (prompt, generationType = 'ai/text-generate') => {
  if (!teachfloor) {
    return Promise.reject(new Error('Teachfloor is not available'))
  }

  return teachfloor.generate(prompt, generationType)
}

export { createCollection } from './collection'
export { createStorage } from './storage'
export { realtime } from './realtime'
