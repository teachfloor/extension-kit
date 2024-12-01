import React from 'react'

import { Box } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Box',
  component: Box,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

/**
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
export const Example = () => (
  <Box p="xl" sx={{ backgroundColor: '#FFF' }}>This is a Box</Box>
)
