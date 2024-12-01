import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Tooltip, Button } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Tooltip',
  component: Tooltip,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Tooltip label="Tooltip" withinPortal>
    <Button variant="outline">Button with tooltip</Button>
  </Tooltip>
);

export const Positions = () => (
  <Group position="center">
    <Tooltip label="Tooltip" position="top" withinPortal>
      <Button variant="outline">Top</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="top-start" withinPortal>
      <Button variant="outline">Top start</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="top-end" withinPortal>
      <Button variant="outline">Top end</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="left" withinPortal>
      <Button variant="outline">Left</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="left-start" withinPortal>
      <Button variant="outline">Left start</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="left-end" withinPortal>
      <Button variant="outline">Left end</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="right" withinPortal>
      <Button variant="outline">Right</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="right-start" withinPortal>
      <Button variant="outline">Right start</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="right-end" withinPortal>
      <Button variant="outline">Right end</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="bottom" withinPortal>
      <Button variant="outline">Bottom</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="bottom-start" withinPortal>
      <Button variant="outline">Bottom start</Button>
    </Tooltip>
    <Tooltip label="Tooltip" position="bottom-end" withinPortal>
      <Button variant="outline">Bottom end</Button>
    </Tooltip>
  </Group>
);
