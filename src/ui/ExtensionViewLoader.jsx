import React, { lazy, Suspense } from 'react'

import { useExtensionContext } from '../'
import { SURFACES } from '../constants'
import { NotFoundView } from './NotFoundView'

/**
 * Find the best-matching view for the current iframe based on the
 * environment payload the host sent via `__set_context`.
 *
 * Two-axis resolution — surface first, then either the widget id
 * (widget surface) or the viewport (everything else):
 *
 *   1. Filter to entries matching `environment.surface`. An entry with
 *      no `surface` field defaults to `drawer`; the environment default
 *      is also `drawer` for older hosts that don't send a surface.
 *
 *   2. If `surface === 'widget'` AND `environment.view.id` is set, pick
 *      the entry whose `widget.id === environment.view.id`. This is how
 *      multiple widgets sharing the same viewport get disambiguated —
 *      the host tells the iframe WHICH widget it is via `view.id`, and
 *      that beats any viewport wildcard sort. Returns `null` if no such
 *      widget id exists in the manifest (surfacing a NotFoundView so
 *      the developer notices the mismatch instead of silently rendering
 *      an unrelated widget).
 *
 *   3. Otherwise fall back to viewport matching within the filtered
 *      set: exact viewport first, then longest-prefix wildcard, then
 *      bare `*` catch-all. Same ordering as before this multi-surface
 *      work landed — more specific always beats wildcards.
 *
 * The second argument used to be just `currentViewport`; it's now the
 * full `environment` object so the resolver can see `surface`, `view`,
 * and `viewport` together. Only `ExtensionViewLoader` calls this so
 * app authors don't see the signature change.
 */
const resolveView = (views, environment) => {
  const viewport = environment?.viewport
  if (!viewport) return null

  const surface = environment?.surface || SURFACES.DRAWER
  const viewId = environment?.view?.id

  const surfaceMatches = views.filter((v) => (v.surface || SURFACES.DRAWER) === surface)

  // Widget surface with an explicit view.id from the host: the iframe
  // was placed as a specific widget, so the manifest match MUST agree
  // on widget id — viewport patterns don't disambiguate here.
  if (surface === SURFACES.WIDGET && viewId) {
    return surfaceMatches.find(
      (v) => v.widget && v.widget.id === viewId,
    ) || null
  }

  const exact = surfaceMatches.find((v) => v.viewport === viewport)
  if (exact) return exact

  const wildcardMatches = surfaceMatches
    .filter((v) => typeof v.viewport === 'string' && v.viewport.endsWith('*'))
    .map((v) => ({ view: v, prefix: v.viewport.slice(0, -1) }))
    .filter(({ prefix }) => prefix === '' || viewport.startsWith(prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)

  return wildcardMatches[0]?.view || null
}

/**
 * Extension View Loader
 *
 * Picks which view component to mount based on the current iframe's
 * environment payload (surface + viewport + optional view id) and the
 * app's manifest. Supports exact viewport names ("settings",
 * "teachfloor.dashboard.course.detail") and suffix wildcards
 * ("teachfloor.dashboard.*", "*"). Widget iframes disambiguate by
 * `environment.view.id`; drawer/page iframes by viewport as before.
 * See `resolveView` above for details.
 */
export const ExtensionViewLoader = ({
  manifest = null,
  fallback = null,
  basePath = './',
  componentResolver = null
}) => {
  const { environment } = useExtensionContext()

  const getViews = () => {
    if (!manifest || !manifest.ui_extension || !manifest.ui_extension.views) {
      return []
    }

    return manifest.ui_extension.views
  }

  const view = resolveView(getViews(), environment)

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
