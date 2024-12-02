import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Loader } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Loader',
  component: Loader,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Loader />
);

export const Sizes = () => (
  <Group>
    <Loader size="xs" />
    <Loader size="sm" />
    <Loader size="md" />
    <Loader size="lg" />
    <Loader size="xl" />
  </Group>
);
