import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Badge } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Badge',
  component: Badge,

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
  <Badge>Default Badge</Badge>
)

export const Colors = () => (
  <Group>
    <Badge color="dark">Dark</Badge>
    <Badge color="gray">Gray</Badge>
    <Badge color="red">Red</Badge>
    <Badge color="pink">Pink</Badge>
    <Badge color="grape">Grape</Badge>
    <Badge color="violet">Violet</Badge>
    <Badge color="indigo">Indigo</Badge>
    <Badge color="blue">Blue</Badge>
    <Badge color="cyan">Cyan</Badge>
    <Badge color="teal">Teal</Badge>
    <Badge color="green">Green</Badge>
    <Badge color="lime">Lime</Badge>
    <Badge color="yellow">Yellow</Badge>
    <Badge color="orange">Orange</Badge>
  </Group>
);

export const Radius = () => (
  <Group>
    <Badge radius="xs">Extra Small</Badge>
    <Badge radius="sm">Small</Badge>
    <Badge radius="md">Medium</Badge>
    <Badge radius="lg">Large</Badge>
    <Badge radius="xl">Extra Large</Badge>
  </Group>
);


export const Sizes = () => (
  <Group>
    <Badge size="xs">Extra Small</Badge>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
    <Badge size="lg">Large</Badge>
    <Badge size="xl">Extra Large</Badge>
  </Group>
);