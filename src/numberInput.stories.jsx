import React from 'react'

import { Stack } from '@teachfloor/ui-kit'
import { TextInput } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'TextInput',
  component: TextInput,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Stack w={360}>
    <TextInput
      placeholder="Your name"
      label="Full name"
      withAsterisk
    />
  </Stack>
);

export const InvalidState = () => (
  <Stack w={360}>
    <TextInput
      placeholder="you@example.com"
      label="Your Email"
      error
    />
    <TextInput
      placeholder="you@example.com"
      label="Your Email"
      error="Invalid email"
    />
  </Stack>
);

export const DisabledState = () => (
  <Stack w={360}>
    <TextInput
      placeholder="Your email"
      label="Disabled without value"
      disabled
    />
    <TextInput
      value="you@example.com"
      label="Disabled with value"
      disabled
    />
  </Stack>
);
