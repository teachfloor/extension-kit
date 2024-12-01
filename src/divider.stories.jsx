import React from 'react'

import { Group, Box, Text } from '@teachfloor/ui-kit'
import { Divider } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Divider',
  component: Divider,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},

  parameters: {
    backgrounds: {
      default: 'white',
    },
  }
}

/**
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
export const Example = () => (
  <Box miw={460} maw={640}>
    <Divider my="lg" />
    <Divider my="lg" variant="dashed" />
    <Divider my="lg" variant="dotted" />
  </Box>
)

export const WithLabel = () => (
  <Box miw={460} maw={640}>
    <Divider my="lg" label="Label on the left" />
    <Divider my="lg" label="Label in the center" labelPosition="center" />
    <Divider my="lg" label="Label on the right" labelPosition="right" />
  </Box>
)

export const Sizes = () => (
  <Box miw={460} maw={640}>
    <Divider my="lg" size="xs" />
    <Divider my="lg" size="sm" />
    <Divider my="lg" size="md" />
    <Divider my="lg" size="lg" />
    <Divider my="lg" size="xl" />
    <Divider my="lg" size={10} />
  </Box>
)

export const VerticalOrientation = () => (
  <Group>
    <Text>Label</Text>
    <Divider orientation="vertical" />
    <Text>Label</Text>
    <Divider size="sm" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="md" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="lg" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="xl" orientation="vertical" />
    <Text>Label</Text>
  </Group>
)
