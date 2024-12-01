import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Button } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Button',
  component: Button,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Button>Default Button</Button>
);

export const Variants = () => (
  <Group>
    <Button variant="light">Light Button</Button>
    <Button variant="outline">Outline Button</Button>
    <Button variant="default">Default Button</Button>
    <Button variant="subtle">Subtle Button</Button>
  </Group>
);

export const Sizes = () => (
  <Group>
    <Button size="xs">Size Extra Small</Button>
    <Button size="sm">Size Small</Button>
    <Button size="md">Size Medium</Button>
    <Button size="lg">Size Large</Button>
    <Button size="xl">Size Extra Large</Button>
  </Group>
);

export const Extras = () => (
  <Group>
    <Button disabled>Disabled Button</Button>
    <Button compact>Compact Button</Button>
    <Button uppercase>Uppercase Button</Button>
    <Button loading>Loading Button</Button>
  </Group>
);
