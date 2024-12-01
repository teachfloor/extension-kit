import React from 'react'

import { Switch } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Switch',
  component: Switch,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Switch
    label="I agree to sell my privacy"
  />
);

export const DisabledState = () => (
  <Switch label="Disabled switch" disabled />
);

export const InnerLabels = () => (
  <Switch onLabel="ON" offLabel="OFF" />
);
