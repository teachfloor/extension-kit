import React, { lazy, Suspense } from 'react'

import { useExtensionContext } from '../'
import { NotFoundView } from './NotFoundView'

/**
 * Find the best-matching view for `currentViewport` inside `views`.
 *
 * Resolution order — more specific entries always beat wildcards, so an
 * app can declare a catch-all alongside one or more exact overrides:
 *
 *   1. Exact match            — e.g. `"settings" === "settings"`
 *   2. Suffix-wildcard match  — e.g. `"teachfloor.dashboard.*"` matches any
 *                               viewport whose name starts with
 *                               `"teachfloor.dashboard."`
 *   3. Bare `"*"` catch-all   — last resort
 *
 * When several wildcards match, the one with the longest prefix wins
 * (e.g. `"teachfloor.dashboard.course.*"` beats `"teachfloor.dashboard.*"`).
 */
const resolveView = (views, currentViewport) => {
  if (!currentViewport) return null

  const exact = views.find((v) => v.viewport === currentViewport)
  if (exact) return exact

  const wildcardMatches = views
    .filter((v) => typeof v.viewport === 'string' && v.viewport.endsWith('*'))
    .map((v) => ({ view: v, prefix: v.viewport.slice(0, -1) })) // drop trailing "*"
    .filter(({ prefix }) => prefix === '' || currentViewport.startsWith(prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length) // longest prefix first

  return wildcardMatches[0]?.view || null
}

/**
 * Extension View Loader
 *
 * Picks which view component to mount based on the current viewport and
 * the app's manifest. Supports exact viewport names ("settings",
 * "teachfloor.dashboard.course.detail") and suffix wildcards
 * ("teachfloor.dashboard.*", "*"). Exact entries always win over
 * wildcards — see `resolveView` above.
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

  const view = resolveView(getViews(), getCurrentViewport())

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