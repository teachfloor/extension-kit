import React, { lazy, Suspense } from 'react'
import { useExtensionContext } from '../'

/**
 * Extension View Loader
 */
export const ExtensionViewLoader = ({
  manifest = null,
  fallback = null,
  basePath = './',
  componentResolver = null
}) => {
  const { environment } = useExtensionContext()

  const getCurrentViewport = () => (
    environment?.viewport || null
  )

  const getView = () => {
    if (!manifest || !manifest.ui_extension || !manifest.ui_extension.views) {
      return null
    }

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

  const ViewComponent = lazy(() => {
    if (componentResolver) {
      return componentResolver(view.component)
    }

    return import(`${basePath}${view.component}`)
  })

  return (
    <Suspense fallback={fallback}>
      <ViewComponent />
    </Suspense>
  )
}