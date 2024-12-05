import React, { lazy, Suspense } from 'react'
import { useExtensionContext } from '../'
import { NotFoundView } from './'

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

  const getViews = () => {
    if (!manifest || !manifest.ui_extension || !manifest.ui_extension.views) {
      return []
    }

    return manifest.ui_extension.views
  }

  const getView = () => {
    return getViews().find((v) => {
      if (!v.viewport) {
        return null
      }

      return v.viewport === getCurrentViewport()
    });
  }

  const view = getView()

  if (!view) {
    return <NotFoundView />
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