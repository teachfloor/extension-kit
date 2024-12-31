import React, { useEffect, useRef } from 'react'
import {
  Container,
  SimpleGrid,
  Group,
  Box,
  Button,
  Text,
  Divider,
  useExtensionContext,
} from '../'

import { NotFoundView } from './NotFoundView'

/**
 * Settings View
 */
export const SettingsView = ({
  onSave,
  statusMessage,
  children
}) => {
  const ref = useRef(null)
  const { appContext } = useExtensionContext()

  /**
   * Emit view height
   */
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      if (teachfloor) {
        teachfloor.emit('app.view.height', ref.current?.clientHeight)
      }
    })

    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  /**
   * Decide if the settings view should be rendered
   * or not based on the app target.
   * The app target determines if the app is loaded in a
   * view (drawer) or the settings page.
   *
   * Default target is `view`
   */
  const shouldBeRendered = () => {
    const target = appContext.target || 'view'

    if (target === 'settings') {
      return true
    }

    return false
  }

  if (!shouldBeRendered()) {
    return <NotFoundView />
  }

  return (
    <Container pt="md" ref={ref}>
      <SimpleGrid>
        <Group position="apart" noWrap>
          <Text fw={700} size="lg">Settings</Text>
          <Group noWrap>
            {statusMessage ? <Text size="sm" color="dimmed">{statusMessage}</Text> : null}
            <Button onClick={onSave}>Save changes</Button>
          </Group>
        </Group>
        <Divider />
        <Box>
          {children}
        </Box>
      </SimpleGrid>
    </Container>
  )
}