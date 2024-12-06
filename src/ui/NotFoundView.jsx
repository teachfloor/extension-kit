import React from 'react'
import { useExtensionContext } from '../'
import { SimpleGrid, Group, Button } from '.'

export const NotFoundView = () => {
  const { appContext, environment } = useExtensionContext()

  const renderAvailableViews = () => (
    appContext.views.map((view) => (
      <Group position="center">
        <Button variant="default">{view}</Button>
      </Group>
    ))
  )

  return (
    <SimpleGrid>
      {renderAvailableViews()}
    </SimpleGrid>
  )
}