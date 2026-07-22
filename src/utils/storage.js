import { store, retrieve } from './index'
import { packKey } from './keyEnvelope'

const NAMESPACE_SEPARATOR = ':'

/**
 * Storage Manager for key-value data (app or user scope) with a
 * richer API than the flat `store` / `retrieve` primitives.
 *
 * Currently provides:
 *   - Namespaced set / get / remove
 *   - TTL / expiry on write (auto-expire values after N seconds)
 *
 * Not yet available (backend endpoints pending — see the
 * "SDK primitives backlog" section in the surfaces system doc):
 *   - Cheap existence check (`has`)
 *   - Atomic counters (`increment` / `decrement`)
 *   - Enumeration by pattern with pagination (`list`)
 *
 * `baseKey` acts as a namespace prefix — every operation is
 * automatically scoped under it, so different features of an app
 * can each hold their own storage instances without key collisions.
 *
 * The namespace is applied client-side by composing the row key
 * as `<baseKey>:<key>`. Apps mixing this class with the flat
 * `store` / `retrieve` primitives should avoid keys that collide
 * with the composed shape.
 *
 * @example
 * // Per-user preferences with an ephemeral flag
 * const prefs = createStorage('user_prefs', { source: 'userdata' })
 * await prefs.set('theme', 'dark')             // row key: 'user_prefs:theme'
 * const theme = await prefs.get('theme')
 * await prefs.set('badge_visible', true, { ttl: 3600 })
 * await prefs.remove('theme')
 */
class StorageManager {
  /**
   * @param {string} baseKey - Namespace prefix; all keys are scoped under this
   * @param {Object} [options]
   * @param {string} [options.source='appdata'] - 'appdata' or 'userdata'
   * @param {number} [options.defaultLimit=100] - Default page size for `list()`
   */
  constructor(baseKey, options = {}) {
    if (typeof baseKey !== 'string' || baseKey.length === 0) {
      throw new Error('createStorage: baseKey is required (namespace prefix)')
    }
    this.baseKey = baseKey
    this.source = options.source || 'appdata'
    this.defaultLimit = options.defaultLimit || 100
  }

  /**
   * Compose `<baseKey>:<key>` — the actual row key stored server-side.
   * The `:` separator matches the Redis-style namespacing convention
   * apps already use in their key names.
   */
  _composedKey(key) {
    return `${this.baseKey}${NAMESPACE_SEPARATOR}${key}`
  }

  /**
   * Strip the `<baseKey>:` prefix from a server-returned key so
   * callers see the sub-key they passed in — round-trips cleanly
   * with `get()` / `set()` / `remove()`.
   *
   * Currently only used by the (commented-out) `list()` method —
   * kept in place so re-enabling `list()` is a single-block uncomment.
   */
  _stripPrefix(composedKey) {
    const prefix = `${this.baseKey}${NAMESPACE_SEPARATOR}`
    return composedKey.startsWith(prefix)
      ? composedKey.slice(prefix.length)
      : composedKey
  }

  /**
   * Write a value under `key`. Optional `ttl` (seconds) causes the
   * value to auto-expire — after that, `get()` returns null and
   * `has()` returns false.
   *
   * @param {string} key
   * @param {*} value - The value to store (JSON-serializable)
   * @param {Object} [options]
   * @param {number} [options.ttl] - Seconds until expiry (omit for no expiry)
   * @returns {Promise<*>} The stored value
   *
   * @example
   * await storage.set('theme', 'dark')
   * await storage.set('temp_flag', true, { ttl: 60 })
   */
  async set(key, value, options = {}) {
    const packedKey = packKey(
      this._composedKey(key),
      options.ttl != null ? { ttl: options.ttl } : {},
    )
    return store(packedKey, value, this.source)
  }

  /**
   * Read a value by `key`. Returns null when the key doesn't exist
   * or has expired.
   *
   * @param {string} key
   * @returns {Promise<*|null>}
   *
   * @example
   * const theme = await storage.get('theme')
   */
  async get(key) {
    const packedKey = packKey(this._composedKey(key), {})
    return retrieve(packedKey, this.source)
  }

  /**
   * ---------- NOT YET WIRED (see SDK primitives backlog / S2) ----------
   * `has(key)` — cheap existence check without transferring the value
   * payload. Kit-side code + backend trait/controller exist; the wire
   * path is pending an open URL-shape decision. Uncomment once the
   * backend endpoint lands.
   *
   * async has(key) {
   *   const packedKey = packKey(this._composedKey(key), { action: 'has' })
   *   const result = await retrieve(packedKey, this.source)
   *   return !!(result && result.exists)
   * }
   * ---------------------------------------------------------------------
   */

  /**
   * Delete a key. No error if the key doesn't exist.
   *
   * @param {string} key
   * @returns {Promise<void>}
   *
   * @example
   * await storage.remove('temp_flag')
   */
  async remove(key) {
    const packedKey = packKey(this._composedKey(key), { action: 'delete' })
    return store(packedKey, null, this.source)
  }

  /**
   * ---------- NOT YET WIRED (see SDK primitives backlog / S3) ----------
   * `increment(key, { by, ttl })` and `decrement(key, { by, ttl })` —
   * atomic counter on the storage row. Backend trait already handles
   * this with a row-locked transaction (see `HasAppStore::incrementData`);
   * the wire path is pending an open URL-shape decision. Uncomment once
   * the backend endpoint lands.
   *
   * async increment(key, options = {}) {
   *   const packedKey = packKey(this._composedKey(key), {
   *     action: 'increment',
   *     by: options.by != null ? options.by : 1,
   *     ...(options.ttl != null ? { ttl: options.ttl } : {}),
   *   })
   *   // Mutation → goes through store(); host dispatcher routes the
   *   // 'increment' action to POST /sdk/{source}/increment.
   *   return store(packedKey, null, this.source)
   * }
   *
   * async decrement(key, options = {}) {
   *   return this.increment(key, {
   *     ...options,
   *     by: -(options.by != null ? options.by : 1),
   *   })
   * }
   * ---------------------------------------------------------------------
   */

  /**
   * ---------- NOT YET WIRED (see SDK primitives backlog / S1) ----------
   * `list({ pattern, limit, cursor })` — enumerate keys under this
   * namespace with `*`-wildcard pattern + cursor pagination. Backend
   * trait already implements this (see `HasAppStore::listData`); the
   * wire path is pending an open URL-shape decision. Uncomment (and
   * the `_stripPrefix` helper above) once the backend endpoint lands.
   *
   * async list(options = {}) {
   *   // Scope every list under the namespace. If the caller didn't
   *   // pass a pattern, we scan the whole namespace via `*`.
   *   const scopedPattern = this._composedKey(options.pattern || '*')
   *
   *   const params = {
   *     action: 'list',
   *     pattern: scopedPattern,
   *     limit: options.limit || this.defaultLimit,
   *   }
   *   if (options.cursor) params.next = options.cursor
   *
   *   const packedKey = packKey(this.baseKey, params)
   *   const result = await retrieve(packedKey, this.source)
   *
   *   const rawKeys = (result && result.data) || []
   *
   *   return {
   *     keys: rawKeys.map((k) => this._stripPrefix(k)),
   *     hasMore: !!(result && result.pagination && result.pagination.next),
   *     nextCursor: (result && result.pagination && result.pagination.next) || null,
   *   }
   * }
   * ---------------------------------------------------------------------
   */

  /**
   * @returns {string} The namespace prefix this storage was created with
   */
  getKey() {
    return this.baseKey
  }

  /**
   * @returns {string} 'appdata' or 'userdata'
   */
  getSource() {
    return this.source
  }
}

/**
 * Create a new storage manager instance.
 *
 * @param {string} baseKey - Namespace prefix for all keys managed by this instance
 * @param {Object} [options]
 * @param {string} [options.source='appdata'] - 'appdata' (org-scoped) or 'userdata' (per-user)
 * @param {number} [options.defaultLimit=100] - Default page size for `list()` (unused until list() ships)
 * @returns {StorageManager}
 *
 * @example
 * import { createStorage } from '@teachfloor/extension-kit'
 *
 * const prefs = createStorage('user_prefs', { source: 'userdata' })
 * await prefs.set('theme', 'dark')
 * await prefs.set('badge_visible', true, { ttl: 3600 })
 * const theme = await prefs.get('theme')
 * await prefs.remove('badge_visible')
 */
export const createStorage = (baseKey, options = {}) => {
  return new StorageManager(baseKey, options)
}
