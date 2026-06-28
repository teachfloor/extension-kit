/**
 * Realtime channels for extension apps.
 *
 * Thin client wrapper around the host-side PostMessageRPC bridge —
 * mirrors the `subscribeToEvent` / `generate` / `store` pattern. The
 * host owns the single WebSocket connection and forwards events into
 * the iframe via `realtime.event` / `realtime.error` RPC messages;
 * this module routes those into the right channel's listener set.
 *
 * Channel format (server-validated): `app.{appKey}.{scope}.{id}`
 * Allowed scopes in v1: `course`, `user`.
 *
 * See `docs/extension-apps/12-realtime.md` for the full developer
 * guide, including security model and host wiring.
 */

const ALLOWED_SCOPES = ['course', 'user']
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/

/**
 * Module-level subscription registry. Lives for the lifetime of the
 * iframe (a fresh mount gets a fresh module — the host tears down
 * its Echo subscriptions on iframe unmount).
 *
 * subscriptionId → {
 *   scope, id,
 *   onListeners:  Map<eventName, Set<callback>>,
 *   anyListeners: Set<callback>,
 *   errorHandler: callback | null,
 *   closed:       boolean,
 * }
 */
const registry = new Map()

let seq = 0
let wired = false

/**
 * Lazily attach the host→app listeners exactly once. Keeps the kit
 * import side-effect-free for apps that don't use realtime.
 */
const ensureWired = () => {
  if (wired || typeof teachfloor === 'undefined' || !teachfloor) return

  teachfloor.on('app.realtime.event', (raw) => {
    const { subscriptionId, event, data, fromUserId, at } = raw || {}
    const reg = registry.get(subscriptionId)
    if (!reg || reg.closed) return

    const payload = { data: data || {}, fromUserId, at }

    const namedSet = reg.onListeners.get(event)
    if (namedSet) {
      namedSet.forEach((cb) => {
        try { cb(payload) } catch (err) {
          /* eslint-disable-next-line no-console */
          console.error(`[teachfloor realtime] listener for "${event}" threw:`, err)
        }
      })
    }

    reg.anyListeners.forEach((cb) => {
      try { cb(event, payload) } catch (err) {
        /* eslint-disable-next-line no-console */
        console.error('[teachfloor realtime] onAny listener threw:', err)
      }
    })
  })

  teachfloor.on('app.realtime.error', (raw) => {
    const { subscriptionId, code, message, retryAfterSeconds } = raw || {}
    const reg = registry.get(subscriptionId)

    if (reg && reg.errorHandler) {
      try {
        reg.errorHandler({ code, message, retryAfterSeconds })
      } catch (err) {
        /* eslint-disable-next-line no-console */
        console.error('[teachfloor realtime] onError handler threw:', err)
      }
    } else {
      /* eslint-disable-next-line no-console */
      console.warn(`[teachfloor realtime] ${code || 'error'}: ${message || 'unknown error'}`)
    }
  })

  wired = true
}

const newSubscriptionId = () => {
  seq += 1
  return `rt-${Date.now().toString(36)}-${seq.toString(36)}`
}

/**
 * Channel returned when `teachfloor` isn't available (e.g. Storybook,
 * server-side render). Every method is a noop so consumer code can
 * still call `.on()` / `.publish()` without crashing.
 */
const noopChannel = (scope, id) => ({
  on() { return () => { } },
  onAny() { return () => { } },
  onError() { return () => { } },
  publish() { },
  unsubscribe() { },
  get subscriptionId() { return null },
  get scope() { return scope },
  get resourceId() { return id },
  get isClosed() { return true },
})

const validateSubscribeArgs = ({ scope, id } = {}) => {
  if (!ALLOWED_SCOPES.includes(scope)) {
    throw new Error(
      `realtime.subscribe: scope must be one of [${ALLOWED_SCOPES.join(', ')}], got ${JSON.stringify(scope)}`,
    )
  }
  if (id === undefined || id === null || id === '') {
    throw new Error('realtime.subscribe: id is required (course id or user id)')
  }
}

/**
 * Subscribe to an app-scoped channel.
 *
 * @param {Object} options
 * @param {'course' | 'user'} options.scope - Channel scope.
 * @param {string|number} options.id - Resource id (course id or user id).
 * @returns {Channel} A channel object with `on`, `onAny`, `onError`, `publish`, `unsubscribe`.
 *
 * @typedef {Object} Channel
 * @property {(event: string, callback: (payload: EventPayload) => void) => () => void} on
 *   Listen for a single named event. Returns a function that removes this listener.
 * @property {(callback: (event: string, payload: EventPayload) => void) => () => void} onAny
 *   Listen for every event on this channel.
 * @property {(callback: (err: ChannelError) => void) => () => void} onError
 *   Register a single error handler. Overwrites any previous handler.
 * @property {(event: string, data?: Object) => void} publish
 *   Broadcast an event to other subscribers. The publisher does NOT receive
 *   their own event back (backend uses `toOthers()`).
 * @property {() => void} unsubscribe
 *   Tear down the subscription. Safe to call multiple times.
 *
 * @typedef {Object} EventPayload
 * @property {Object} data         - What the publisher passed to `.publish()`.
 * @property {number} fromUserId   - Publisher's user id.
 * @property {string} at           - ISO timestamp from the server.
 *
 * @typedef {Object} ChannelError
 * @property {string} code         - Machine-readable code (`rate_limited`, `subscribe_failed`, …).
 * @property {string} message      - Human-readable description.
 * @property {number} [retryAfterSeconds]
 *
 * @example
 * import { realtime } from '@teachfloor/extension-kit'
 *
 * const channel = realtime.subscribe({ scope: 'course', id: courseId })
 *
 * channel.on('card_added', ({ data, fromUserId }) => {
 *   console.log('peer added a card:', data, 'from user', fromUserId)
 * })
 *
 * channel.publish('card_added', { cardId: 'abc', front: 'Q', back: 'A' })
 *
 * channel.onError(({ code, message }) => {
 *   console.warn('realtime error:', code, message)
 * })
 *
 * // React useEffect cleanup:
 * useEffect(() => {
 *   const off = channel.on('card_added', handler)
 *   return off
 * }, [])
 *
 * // Tear down:
 * channel.unsubscribe()
 */
export const subscribe = ({ scope, id } = {}) => {
  validateSubscribeArgs({ scope, id })

  if (typeof teachfloor === 'undefined' || !teachfloor) {
    return noopChannel(scope, id)
  }

  ensureWired()

  const subscriptionId = newSubscriptionId()

  const reg = {
    scope,
    id,
    onListeners: new Map(),
    anyListeners: new Set(),
    errorHandler: null,
    closed: false,
  }
  registry.set(subscriptionId, reg)

  teachfloor.emit('app.realtime.subscribe', { subscriptionId, scope, id })

  return {
    on(event, callback) {
      if (typeof event !== 'string' || !event) {
        throw new Error('channel.on: event name (string) is required')
      }
      if (typeof callback !== 'function') {
        throw new Error('channel.on: callback (function) is required')
      }
      if (!reg.onListeners.has(event)) reg.onListeners.set(event, new Set())
      const set = reg.onListeners.get(event)
      set.add(callback)
      return () => { set.delete(callback) }
    },

    onAny(callback) {
      if (typeof callback !== 'function') {
        throw new Error('channel.onAny: callback (function) is required')
      }
      reg.anyListeners.add(callback)
      return () => { reg.anyListeners.delete(callback) }
    },

    onError(callback) {
      if (callback !== null && typeof callback !== 'function') {
        throw new Error('channel.onError: callback must be a function or null')
      }
      reg.errorHandler = callback
      return () => {
        if (reg.errorHandler === callback) reg.errorHandler = null
      }
    },

    /**
     * Reject malformed event names client-side so the developer
     * gets a clear local error rather than a 422 the SDK has to
     * dig out of network devtools. The regex matches the
     * server-side validator in SDKRealtimeController.
     */
    publish(event, data) {
      if (reg.closed) {
        throw new Error('channel.publish: cannot publish on a closed channel')
      }
      if (typeof event !== 'string' || !EVENT_NAME_PATTERN.test(event)) {
        throw new Error(
          `channel.publish: event must match ${EVENT_NAME_PATTERN} (max 64 chars), got ${JSON.stringify(event)}`,
        )
      }
      const payload = (data && typeof data === 'object') ? data : {}
      teachfloor.emit('app.realtime.publish', { subscriptionId, event, data: payload })
    },

    unsubscribe() {
      if (reg.closed) return
      reg.closed = true
      try {
        teachfloor.emit('app.realtime.unsubscribe', { subscriptionId })
      } catch (err) {
        /* swallow — host may have already torn down */
      }
      reg.onListeners.clear()
      reg.anyListeners.clear()
      reg.errorHandler = null
      registry.delete(subscriptionId)
    },

    get subscriptionId() { return subscriptionId },
    get scope() { return reg.scope },
    get resourceId() { return reg.id },
    get isClosed() { return reg.closed },
  }
}

/**
 * Public surface. Wrapped in a namespace so future additions
 * (`realtime.presence(...)`, `realtime.disconnectAll()`) don't
 * break the import shape.
 */
export const realtime = { subscribe }
