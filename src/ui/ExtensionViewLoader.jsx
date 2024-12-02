import React, { lazy, Suspense } from 'react'
import { useExtensionContext } from '../'

/**
 * Extension View Loader
 */
export const ExtensionViewLoader = ({ manifest = null, fallback = null }) => {
  const { environment } = useExtensionContext()

  const getCurrentViewport = () => (
    environment?.viewport || null
  )

  const getView = () => {
    if (!manifest) return null
    if (!manifest.ui_extension) return null
    if (!manifest.ui_extension.views) return null

    return manifest.ui_extension.views.find((v) => {
      if (!v.viewport) {
        return null
      }

      return v.viewport === getCurrentViewport()
    });
  }

  const view = getView()

  if (!view) {
    return null
  }

  const ViewComponent = lazy(() => import(`./${view.component}`))

  return (
    <Suspense fallback={fallback}>
      <ViewComponent />
    </Suspense>
  )
}