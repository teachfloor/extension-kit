import React from 'react'
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

/**
 * Settings View
 */
export const SettingsView = ({
  onSave,
  statusMessage,
  children
}) => {
  const { appContext } = useExtensionContext()

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

    if (target === 'view') {
      return true
    }

    return false
  }

  if (!shouldBeRendered()) {
    return null
  }

  return (
    <Container pt="md">
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