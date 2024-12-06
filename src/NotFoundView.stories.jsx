import React from 'react'

import { Box } from '@teachfloor/ui-kit'
import { NotFoundView } from './ui/NotFoundView'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'NotFoundView',
  component: NotFoundView,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Box mih={300}>
    <NotFoundView views={['teachfloor.dashboard.course.detail', 'settings']} />
  </Box>
);
