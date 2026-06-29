/**
 * HTTP client for extension apps.
 *
 * Thin promise wrapper around the host-side PostMessage RPC bridge —
 * mirrors the `subscribeToEvent` / `realtime.subscribe` pattern. The
 * host owns the actual HTTP transport and forwards responses back into
 * the iframe via `app.http.response` RPC messages; this module just
 * correlates request/response pairs by id and resolves the right
 * Promise.
 *
 * URL space mirrors the public Teachfloor API. The current version is
 * `v0`; the kit auto-prefixes it onto any URL that doesn't already
 * carry one, so `client.get('/courses')` and `client.get('/v0/courses')`
 * both resolve to the same endpoint. Once new versions ship, call
 * `client.setVersion('v1')` (or pass `{ version: 'v1' }` to
 * `createHttpClient`) to switch the default without rewriting every
 * call site.
 *
 * Each call's permission is gated server-side by the resource's first
 * segment against the app's manifest permissions — same model
 * `realtime` uses.
 *
 * See `docs/extension-apps/09-data-fetching.md` for the full developer
 * guide and security model.
 */

const DEFAULT_VERSION = 'v0'
const VERSION_PATTERN = /^v\d+$/
const URL_VERSION_PATTERN = /^\/v\d+\//
const ALLOWED_METHODS = new Set(['GET'])

/**
 * Module-level pending-request registry. Lives for the lifetime of the
 * iframe (a fresh mount gets a fresh module — the host tears down its
 * outstanding promises on iframe unmount).
 *
 * requestId → { resolve, reject }
 */
const pending = new Map()
let seq = 0
let wired = false

/**
 * Lazily attach the host→app response listener exactly once. Keeps the
 * kit import side-effect-free for apps that don't fetch data.
 */
const ensureWired = () => {
  if (wired || typeof teachfloor === 'undefined' || !teachfloor) return
  teachfloor.on('app.http.response', raw => {
    const { requestId, data, error } = raw || {}
    const entry = pending.get(requestId)
    if (!entry) return
    pending.delete(requestId)
    if (error) {
      entry.reject(error)
    } else {
      entry.resolve(data)
    }
  })
  wired = true
}

const newRequestId = () => {
  seq += 1
  return `http-${Date.now().toString(36)}-${seq.toString(36)}`
}

/**
 * Normalize a developer-supplied URL to the on-the-wire form. Accepts:
 *
 *   - `'courses'`        → `'/v0/courses'`
 *   - `'/courses'`       → `'/v0/courses'`
 *   - `'/v0/courses'`    → `'/v0/courses'` (passthrough)
 *   - `'/v1/courses'`    → `'/v1/courses'` (explicit override of default)
 *
 * Throws if the input isn't a non-empty string.
 */
const normalizeUrl = (url, version) => {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error(`url must be a non-empty string, got ${JSON.stringify(url)}`)
  }
  /**
   * Already version-prefixed — let the call author decide which
   * version it targets (useful for one-off calls without flipping the
   * client's default).
   */
  if (URL_VERSION_PATTERN.test(url)) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `/${version}${path}`
}

/**
 * Fallback when the SDK isn't available (Storybook, SSR, unit tests).
 * Every method rejects so consumer code surfaces the issue immediately
 * instead of silently hanging.
 */
const noopClient = () => ({
  get: () => Promise.reject(new Error('Teachfloor SDK is not available')),
  setVersion: () => {},
  getVersion: () => null,
})

/**
 * Build an authenticated HTTP client scoped to the public Teachfloor
 * API. All requests go through the host SPA — the iframe never sees
 * an auth token, never crafts an Authorization header.
 *
 * @param {Object} [options]
 * @param {string} [options.version='v0']  Default API version applied to
 *   URLs that don't already include one. Can be overridden later via
 *   `client.setVersion(...)`.
 *
 * @returns {Client}
 *
 * @typedef {Object} Client
 * @property {(url: string, opts?: RequestOptions) => Promise<any>} get
 * @property {(version: string) => void} setVersion  Change the default
 *   API version for subsequent calls. Validates the format (`v0`,
 *   `v1`, …) and throws on bad input.
 * @property {() => string} getVersion  Current default API version.
 *
 * @typedef {Object} RequestOptions
 * @property {Object} [params]  Query-string parameters (URL-encoded by the host)
 *
 * @example
 * import { createHttpClient } from '@teachfloor/extension-kit'
 *
 * const client = createHttpClient()
 *
 * const courses = await client.get('/courses', { params: { limit: 20 } })
 * const course  = await client.get(`/courses/${courseId}`)
 *
 * // Explicit version per call (passthrough — bypasses the client default)
 * const next = await client.get('/v1/courses')
 *
 * // Flip the client's default for the rest of the session
 * client.setVersion('v1')
 *
 * try {
 *   const members = await client.get(`/courses/${courseId}/members`)
 * } catch (err) {
 *   console.warn('failed to load members:', err.code, err.message)
 * }
 */
export const createHttpClient = (options = {}) => {
  if (typeof teachfloor === 'undefined' || !teachfloor) {
    return noopClient()
  }
  ensureWired()

  let version = options.version || DEFAULT_VERSION
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`createHttpClient: version must match ${VERSION_PATTERN} (e.g. "v0", "v1"), got ${JSON.stringify(version)}`)
  }

  /**
   * Reject malformed URLs / methods client-side so the developer gets
   * a clear local error rather than digging a 403/405 out of network
   * devtools. The same checks run server-side too — these guards just
   * shorten the feedback loop during development.
   */
  const request = (method, url, opts = {}) => {
    if (!ALLOWED_METHODS.has(method)) {
      return Promise.reject(new Error(`createHttpClient does not support ${method} — only GET is supported in this version`))
    }

    let normalized
    try {
      normalized = normalizeUrl(url, version)
    } catch (err) {
      return Promise.reject(err)
    }

    const requestId = newRequestId()
    return new Promise((resolve, reject) => {
      pending.set(requestId, { resolve, reject })
      teachfloor.emit('app.http.request', {
        requestId,
        method,
        url: normalized,
        params: (opts.params && typeof opts.params === 'object') ? opts.params : null,
      })
    })
  }

  return {
    get: (url, opts) => request('GET', url, opts),
    setVersion: (v) => {
      if (typeof v !== 'string' || !VERSION_PATTERN.test(v)) {
        throw new Error(`setVersion: version must match ${VERSION_PATTERN} (e.g. "v0", "v1"), got ${JSON.stringify(v)}`)
      }
      version = v
    },
    getVersion: () => version,
  }
}
