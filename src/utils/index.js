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

export const goToViewport = (viewport = null) => {
  if (!teachfloor) {
    return
  }

  teachfloor.emit('request.viewport.change', viewport)
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
