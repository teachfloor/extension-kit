import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Radio } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Radio',
  component: Radio,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Radio
    label="I cannot be unchecked"
  />
);

export const DisabledState = () => (
  <Group>
    <Radio checked disabled label="React" value="react" />
    <Radio disabled label="Angular" value="nu" />
    <Radio disabled label="Svelte" value="sv" />
  </Group>
);
