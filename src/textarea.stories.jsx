import React from 'react'

import { Box } from '@teachfloor/ui-kit'
import { Textarea } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Textarea',
  component: Textarea,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Box w={360}>
    <Textarea
      placeholder="Your comment"
      label="Your comment"
    />
  </Box>
);

export const Autosize = () => (
  <Box w={360}>
    <Textarea
      placeholder="Your comment"
      label="Your comment"
      autosize
    />
  </Box>
);
