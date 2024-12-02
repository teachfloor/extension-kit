import React from 'react'

import { Avatar } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Avatar',
  component: Avatar,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},

  parameters: {
    backgrounds: {
      default: 'white',
    }
  }
}

export const Example = () => (
  <Avatar src="https://picsum.photos/64/64" />
);
