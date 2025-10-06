import { store, retrieve } from './index'
import { packKey } from './keyEnvelope'

/**
 * Collection Manager for handling collection data (user or app collections)
 *
 * Provides a fluent API for working with collections including:
 * - Adding items
 * - Updating items
 * - Removing items
 * - Listing with pagination
 * - Auto-pagination for getting all items
 *
 * @example
 * const messages = createCollection('chat-messages', { limit: 15 })
 * await messages.add({ role: 'user', text: 'Hello' })
 * const page = await messages.list()
 * await messages.update(page.items[0].id, { role: 'user', text: 'Updated' })
 * await messages.remove(page.items[0].id)
 * const all = await messages.getAll()
 */
class CollectionManager {
  /**
   * @param {string} baseKey - The base key for this collection
   * @param {Object} options - Configuration options
   * @param {number} options.limit - Default page size (default: 15)
   * @param {string} options.source - Collection source: 'usercollection' or 'appcollection' (default: 'usercollection')
   */
  constructor(baseKey, options = {}) {
    this.baseKey = baseKey
    this.defaultLimit = options.limit || 15
    this.source = options.source || 'usercollection'
  }

  /**
   * Add an item to the collection
   *
   * Creates a new record in the collection. Returns the stored value.
   *
   * @param {*} value - The value to store (object, array, string, number, etc.)
   * @returns {Promise<*>} The stored value
   *
   * @example
   * await collection.add({ role: 'user', text: 'Hello' })
   */
  async add(value) {
    const packedKey = packKey(this.baseKey, {})
    return store(packedKey, value, this.source)
  }

  /**
   * List items from the collection with pagination
   *
   * Returns a page of items with metadata for pagination.
   *
   * @param {Object} options - List options
   * @param {number} options.limit - Number of items to retrieve
   * @param {string} options.cursor - Cursor for pagination (from previous result)
   * @returns {Promise<{items: Array, hasMore: boolean, nextCursor: string|null}>}
   *
   * Each item in the array has the structure:
   * - id: Database record ID
   * - key: The collection key
   * - value: The stored data (your actual data)
   * - created_at: ISO timestamp
   * - updated_at: ISO timestamp
   *
   * @example
   * const page1 = await collection.list()
   * console.log(page1.items) // Array of collection records
   * console.log(page1.items[0].value) // Your actual data
   *
   * if (page1.hasMore) {
   *   const page2 = await collection.list({ cursor: page1.nextCursor })
   * }
   */
  async list(options = {}) {
    const params = {
      limit: options.limit || this.defaultLimit
    }

    if (options.cursor) {
      params.next = options.cursor
    }

    const packedKey = packKey(this.baseKey, params)
    const result = await retrieve(packedKey, this.source)

    return {
      items: result.data || [],
      hasMore: !!result.pagination?.next,
      nextCursor: result.pagination?.next || null
    }
  }

  /**
   * Update an existing collection item
   *
   * Updates the value of an existing record by its ID.
   *
   * @param {string|number} id - The item ID to update
   * @param {*} value - The new value to store
   * @returns {Promise<*>} The updated value
   *
   * @example
   * const page = await collection.list()
   * const itemId = page.items[0].id
   * await collection.update(itemId, { role: 'user', text: 'Updated message' })
   */
  async update(id, value) {
    const packedKey = packKey(this.baseKey, { id, action: 'update' })
    return store(packedKey, value, this.source)
  }

  /**
   * Remove a collection item
   *
   * Deletes a record from the collection by its ID.
   *
   * @param {string|number} id - The item ID to remove
   * @returns {Promise<null>}
   *
   * @example
   * const page = await collection.list()
   * const itemId = page.items[0].id
   * await collection.remove(itemId)
   */
  async remove(id) {
    const packedKey = packKey(this.baseKey, { id, action: 'delete' })
    return store(packedKey, null, this.source)
  }

  /**
   * Get all items from the collection (auto-pagination)
   *
   * WARNING: This will fetch all pages. Use with caution on large collections.
   *
   * @param {Object} options - Options
   * @param {number} options.limit - Page size for each request
   * @returns {Promise<Array>} All items in the collection
   *
   * @example
   * const allMessages = await collection.getAll()
   * allMessages.forEach(item => {
   *   console.log(item.value) // Your actual data
   *   console.log(item.id)    // Database ID
   *   console.log(item.created_at) // Timestamp
   * })
   */
  async getAll(options = {}) {
    const allItems = []
    let cursor = null

    do {
      const page = await this.list({
        limit: options.limit || this.defaultLimit,
        cursor
      })

      allItems.push(...page.items)
      cursor = page.hasMore ? page.nextCursor : null
    } while (cursor)

    return allItems
  }

  /**
   * Get the base key for this collection
   *
   * @returns {string} The base key
   */
  getKey() {
    return this.baseKey
  }

  /**
   * Get the source type for this collection
   *
   * @returns {string} The source ('usercollection' or 'appcollection')
   */
  getSource() {
    return this.source
  }
}

/**
 * Create a new collection manager instance
 *
 * @param {string} key - The base key for the collection
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Default page size (default: 15)
 * @param {string} options.source - Collection source: 'usercollection' or 'appcollection' (default: 'usercollection')
 * @returns {CollectionManager} A collection manager instance
 *
 * @example
 * import { createCollection } from '@teachfloor/extension-kit'
 *
 * // User collection (default)
 * const messages = createCollection('chat-messages')
 *
 * // Add item
 * await messages.add({ role: 'user', text: 'Hello' })
 *
 * // List items
 * const page = await messages.list()
 *
 * // Update item
 * await messages.update(page.items[0].id, { role: 'user', text: 'Updated' })
 *
 * // Remove item
 * await messages.remove(page.items[0].id)
 *
 * // App collection (future - when supported by backend)
 * const globalData = createCollection('global-stats', { source: 'appcollection' })
 */
export const createCollection = (key, options = {}) => {
  return new CollectionManager(key, options)
}
