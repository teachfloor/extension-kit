import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Chip } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Chip',
  component: Chip,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Chip defaultChecked>Awesome chip</Chip>
);

export const Variants = () => (
  <Group>
    <Chip variant="outline">Outline chip</Chip>
    <Chip variant="light">Light chip</Chip>
    <Chip variant="filled">Filled chip</Chip>
  </Group>
);