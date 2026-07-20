import React from 'react'

import { goToViewport, useExtensionContext } from '../'
import { Container,SimpleGrid, Text, Group, Button } from '.'

const getViewportName = (viewport = '') => {
  const words = viewport.split('.')

  /**
   * Remove teachfloor namespace
   */
  if (words[0] === 'teachfloor') {
    words.shift()
  }

  /**
   * Remove dashboard namespace
   */
  if (words[0] === 'dashboard') {
    words.shift()
  }

  /**
   * Capitalize each word and join them with spaces
   */
  const friendlyName = words
    .map((word) => (
      word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, ' ')
    ))
    .join(' ')

  return friendlyName
}

export const NotFoundView = ({ name = null, views = null }) => {
  const { appContext, environment } = useExtensionContext()

  const getAvailableViews = () => {
    if (views) {
      return views
    }

    /**
     * `appContext.views` is the flat viewport array the host emits.
     * With the widget surface an app can declare multiple views at
     * the same viewport (e.g. two widgets both at
     * `teachfloor.dashboard.dashboard.detail`), which would show up
     * as duplicate buttons — dedupe defensively.
     *
     * Filters:
     *   - omit `settings` (page surface, not a drawer destination)
     *   - omit wildcard viewports (`*`, `teachfloor.dashboard.*`,
     *     etc.) — dispatcher meta-routes, not navigable destinations
     */
    return Array.from(new Set(
      (appContext?.views || [])
        .filter((view) => view !== 'settings')
        .filter((view) => !view.includes('*'))
    ))
  }

  const getAppName = () => {
    if (name) {
      return name
    }

    return appContext?.name || ''
  }

  const renderText = () => {
    if (getAppName()) {
      return <Text ta="center" fw={600}>{`Choose a page below to get started with ${getAppName()}`}</Text>
    }

    return <Text ta="center" fw={600}>Choose a page below to get started</Text>
  }

  const renderAvailableViews = () => (
    getAvailableViews().map((view) => (
      <Button
        key={view}
        variant="default"
        size="xs"
        onClick={() => goToViewport(view)}
      >
        {getViewportName(view)}
      </Button>
    ))
  )

  if (!getAvailableViews().length) {
    return null
  }

  return (
    <Container p="xl">
      <SimpleGrid>
        {renderText()}
        <SimpleGrid verticalSpacing="xs">
          {renderAvailableViews()}
        </SimpleGrid>
      </SimpleGrid>
    </Container>
  )
}