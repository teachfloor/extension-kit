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