export const showToast = (message = null, options = {}) => {
  if (!teachfloor || !message) {
    return;
  }

  teachfloor.emit('ui.toast.show', { message, ...options })
}

export const showDrawer = () => {
  if (!teachfloor) {
    return;
  }

  teachfloor.emit('ui.drawer.show')
}

export const hideDrawer = () => {
  if (!teachfloor) {
    return;
  }

  teachfloor.emit('ui.drawer.hide')
}

export const toggleDrawer = () => {
  if (!teachfloor) {
    return;
  }

  teachfloor.emit('ui.drawer.toggle')
}
