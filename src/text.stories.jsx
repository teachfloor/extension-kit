import React from 'react'

import { Box } from '@teachfloor/ui-kit'
import { Text } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Text',
  component: Text,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},

  parameters: {
    layout: 'left',
    backgrounds: {
      default: 'white'
    }
  }
}

export const Example = () => (
  <Box p="xl">
    <Text size="xs">Extra small text</Text>
    <Text size="sm">Small text</Text>
    <Text size="md">Medium text</Text>
    <Text size="lg">Large text</Text>
    <Text size="xl">Extra large text</Text>
    <Text fw={500}>Semibold</Text>
    <Text fw={700}>Bold</Text>
    <Text fs="italic">Italic</Text>
    <Text td="underline">Underlined</Text>
    <Text td="line-through">Strikethrough</Text>
    <Text c="dimmed">Dimmed text</Text>
    <Text c="blue">Blue text</Text>
    <Text c="teal.4">Teal 4 text</Text>
    <Text tt="uppercase">Uppercase</Text>
    <Text tt="capitalize">capitalized text</Text>
    <Text ta="center">Aligned to center</Text>
    <Text ta="right">Aligned to right</Text>
  </Box>
);
