import React from 'react'

import { ButtonGroup, Button } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Button Group',
  component: ButtonGroup,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <ButtonGroup>
    <Button variant="default">First</Button>
    <Button variant="default">Second</Button>
    <Button variant="default">Third</Button>
  </ButtonGroup>
);
