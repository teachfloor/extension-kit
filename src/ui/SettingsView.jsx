import React from 'react'
import {
  Container,
  SimpleGrid,
  Group,
  Box,
  Button,
  Text,
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
          <Text fw={700} size="lg">{`${appContext.name} Settings`}</Text>
          <Group noWrap>
            {statusMessage ? <Text size="sm" color="dimmed">{statusMessage}</Text> : null}
            <Button onClick={onSave}>Save changes</Button>
          </Group>
        </Group>
        <Box>
          {children}
        </Box>
      </SimpleGrid>
    </Container>
  )
}