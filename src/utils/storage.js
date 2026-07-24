import { store, retrieve } from './index'
import { packKey } from './keyEnvelope'

// Allow-listed comparators per queryable field for `query()`. Kept
// small on purpose — both this client-side guard and the pending
// backend translator (`HasAppStore::queryData`) walk the same lists.
// Adding a new op or field means one entry on each side, no shape change.
//
// `key`         — string LIKE-friendly ops on the unencrypted row key.
// `created_at`, `updated_at` — range ops on the row timestamps.
// `value`, `expires_at`, `user_id`, etc. are intentionally NOT queryable
// (`value` is encrypted at rest, `expires_at` is internal TTL bookkeeping).
const FIELD_OPS = {
  key: new Set(['=', '!=', 'in', 'not in', 'contains', 'not contains']),
  created_at: new Set(['>', '>=', '<', '<=']),
  updated_at: new Set(['>', '>=', '<', '<=']),
}
const SORT_FIELDS = new Set(['updated_at', 'created_at'])
const SORT_DIRECTIONS = new Set(['asc', 'desc'])

// Cardinality cap on `in` / `not in` array values. Matches the
// backend `AppStoreQuery::MAX_IN_VALUES`. Prevents apps from building
// a SQL `IN (…)` with thousands of entries — bad for MySQL packet
// size + query planner. Callers with more than this many keys to
// resolve should paginate through `query()` instead.
const MAX_IN_VALUES = 100

const NAMESPACE_SEPARATOR = ':'

/**
 * Storage Manager for key-value data (app or user scope) with a
 * richer API than the flat `store` / `retrieve` primitives.
 *
 * Currently provides:
 *   - Namespaced set / get / remove
 *   - TTL / expiry on write (auto-expire values after N seconds)
 *   - Paged iteration of the namespace with a small filter + sort DSL
 *     (`query`) — filters run against metadata columns only (`key`,
 *     `created_at`, `updated_at`); the `value` column is encrypted at
 *     rest and cannot be predicated on. The backend endpoint
 *     (`HasAppStore::queryData`) is pending — kit-side shape is in
 *     place so app code can be authored against the final API.
 *
 * Not yet available (backend endpoints pending — see the
 * "SDK primitives backlog" section in the surfaces system doc):
 *   - Cheap existence check (`has`)
 *   - Atomic counters (`increment` / `decrement`)
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
   * @param {number} [options.defaultLimit=100] - Default page size for `query()`
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
   * with `get()` / `set()` / `remove()`. Used by `query()` when
   * rewriting each returned row's key back into app-facing form.
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
   * Paged iteration of the namespace with a small filter + sort DSL.
   * Filters run against metadata columns only — the `value` column is
   * encrypted at rest and cannot be predicated on. Expired rows are
   * always excluded (no escape hatch).
   *
   * `where` is an array of predicates AND-ed together by default, with
   * `{ and | or: [entries] }` group objects for nested boolean logic.
   * Groups can nest arbitrarily. Non-obvious rule: a group object must
   * carry exactly one of `and` / `or` — supplying both throws (nest an
   * inner group instead).
   *
   * Field / op matrix (whitelisted client-side; backend re-validates):
   *   - `key`                       : =  !=  in  "not in"  contains  "not contains"
   *   - `created_at`, `updated_at`  : >  >=  <  <=
   *
   * For `key` exact-match ops (`=`, `!=`, `in`, `not in`) values are
   * treated as sub-keys and namespaced automatically, matching `get()`
   * / `set()` semantics. `contains` / `not contains` values pass
   * through raw and search the namespace-scoped set (the backend adds
   * the implicit `WHERE key LIKE '<baseKey>:%'` clause per request).
   *
   * Kit-side validators fail loud at the call site with a clear error
   * — the same allow-list runs server-side, so a typo never silently
   * drops predicates without the app knowing.
   *
   * NOT YET FUNCTIONAL — the backend `HasAppStore::queryData` endpoint
   * is pending. Calls will error at the server until it lands; the
   * client-side shape is finalized so app code can be authored now.
   *
   * @param {Object}   [options]
   * @param {Array}    [options.where=[]]              Predicate tree
   * @param {Array}    [options.sort=[['updated_at','desc']]]
   * @param {number}   [options.limit]                 Defaults to `defaultLimit`
   * @param {string}   [options.after]                 Opaque cursor from prev page
   * @returns {Promise<{items: Array, nextCursor: string|null}>}
   *
   * @example
   * // Recent drafts OR any pinned note, newest first
   * const page = await storage.query({
   *   where: [
   *     { or: [
   *       { and: [
   *         ['updated_at', '>=', '2026-07-01'],
   *         ['key', 'contains', 'draft'],
   *       ]},
   *       ['key', 'in', ['pinned-1', 'pinned-2']],
   *     ]},
   *   ],
   *   sort: [['updated_at', 'desc']],
   *   limit: 20,
   * })
   */
  async query(options = {}) {
    const where = this._validateWhere(options.where)
    const sort = this._validateSort(options.sort)
    const packedKey = packKey(this.baseKey, {
      action: 'query',
      where,
      sort,
      limit: options.limit || this.defaultLimit,
      ...(options.after ? { after: options.after } : {}),
    })
    const result = await retrieve(packedKey, this.source)
    const items = ((result && result.items) || []).map((row) => ({
      ...row,
      key: this._stripPrefix(row.key),
    }))
    return { items, nextCursor: (result && result.nextCursor) || null }
  }

  _validateWhere(where) {
    if (!where) return []
    if (!Array.isArray(where)) {
      throw new Error('storage.query: `where` must be an array of predicates or groups')
    }
    return where.map((entry) => this._validateEntry(entry))
  }

  _validateEntry(entry) {
    if (Array.isArray(entry)) return this._validateTuple(entry)
    if (entry && typeof entry === 'object') {
      const hasAnd = Object.prototype.hasOwnProperty.call(entry, 'and')
      const hasOr = Object.prototype.hasOwnProperty.call(entry, 'or')
      if (hasAnd && hasOr) {
        throw new Error('storage.query: group cannot carry both `and` and `or` — nest instead')
      }
      const op = hasAnd ? 'and' : hasOr ? 'or' : null
      if (!op) {
        throw new Error('storage.query: group must have `and` or `or` key')
      }
      if (!Array.isArray(entry[op])) {
        throw new Error(`storage.query: "${op}" value must be an array of entries`)
      }
      return { [op]: entry[op].map((child) => this._validateEntry(child)) }
    }
    throw new Error('storage.query: entry must be a [field, op, value] tuple or a {and|or: [...]} group')
  }

  _validateTuple(pred) {
    if (pred.length !== 3) {
      throw new Error('storage.query: predicate must be [field, op, value]')
    }
    const [field, op, value] = pred
    const allowedOps = FIELD_OPS[field]
    if (!allowedOps) throw new Error(`storage.query: unsupported field "${field}"`)
    if (!allowedOps.has(op)) {
      throw new Error(`storage.query: unsupported operator "${op}" for field "${field}"`)
    }
    if (op === 'in' || op === 'not in') {
      if (!Array.isArray(value)) {
        throw new Error(`storage.query: "${op}" requires an array value`)
      }
      if (value.length > MAX_IN_VALUES) {
        throw new Error(`storage.query: "${op}" cannot accept more than ${MAX_IN_VALUES} values (got ${value.length})`)
      }
    }
    if (field === 'key') {
      return [field, op, this._scopeKeyValue(op, value)]
    }
    return [field, op, value]
  }

  _validateSort(sort) {
    if (!sort) return [['updated_at', 'desc']]
    if (!Array.isArray(sort)) {
      throw new Error('storage.query: `sort` must be an array of [field, direction] tuples')
    }
    return sort.map((pair) => {
      if (!Array.isArray(pair) || pair.length !== 2) {
        throw new Error('storage.query: each sort entry must be [field, direction]')
      }
      const [field, dir] = pair
      if (!SORT_FIELDS.has(field)) {
        throw new Error(`storage.query: unsupported sort field "${field}"`)
      }
      if (!SORT_DIRECTIONS.has(dir)) {
        throw new Error(`storage.query: sort direction must be "asc" or "desc"`)
      }
      return [field, dir]
    })
  }

  _scopeKeyValue(op, value) {
    if (op === 'in' || op === 'not in') {
      return value.map((v) => this._composedKey(v))
    }
    if (op === '=' || op === '!=') {
      return this._composedKey(value)
    }
    return value
  }

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
 * @param {number} [options.defaultLimit=100] - Default page size for `query()`
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
