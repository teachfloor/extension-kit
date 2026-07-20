/**
 * Shared enums exposed to app authors. Group related constants here as
 * new ones land (event names, permission slugs, view types, etc.) so
 * apps have one canonical import path.
 */

/**
 * Rendering surfaces an app can be mounted in.
 *
 *   DRAWER  — the right-side overlay panel opened from the app dock.
 *             The default surface when the host doesn't send one.
 *   PAGE    — inline inside a host page container (e.g. the app-detail
 *             settings page).
 *   WIDGET  — a cell in the dashboard widget grid. Widget iframes get
 *             an extra `environment.view.id` identifying WHICH widget
 *             from the app's manifest is mounted.
 *
 * `useExtensionContext().environment.surface` always equals one of
 * these values. App code should compare against `SURFACES.WIDGET`
 * (etc.) instead of bare strings — the constants are the stable
 * contract, the underlying string values are an implementation detail
 * the kit may rename.
 */
export const SURFACES = Object.freeze({
  DRAWER: 'drawer',
  PAGE: 'page',
  WIDGET: 'widget',
})
