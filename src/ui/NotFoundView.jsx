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

    return (
      (appContext?.views || [])

        /**
         * Avoid recognizing `settings` as a ui_extension view
         */
        .filter((view) => view !== 'settings')
    )
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