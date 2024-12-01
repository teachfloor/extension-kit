import React from 'react'

import { Stack } from '@teachfloor/ui-kit'
import { Checkbox } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Checkbox',
  component: Checkbox,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

/**
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
export const Example = () => (
  <Checkbox label="This is a checkbox" />
)

export const States = () => (
  <Stack>
    <Checkbox label="Default checkbox" />
    <Checkbox label="Indeterminate checkbox" indeterminate />
    <Checkbox label="Indeterminate checked checkbox" checked indeterminate />
    <Checkbox label="Checked checkbox" checked />
    <Checkbox label="Disabled checkbox" disabled />
    <Checkbox label="Disabled checked checkbox" disabled checked />
    <Checkbox label="Disabled indeterminate checkbox" disabled indeterminate />
  </Stack>
)

export const Sizes = () => (
  <Stack>
    <Checkbox size="xs" label="Extra small checkbox" checked />
    <Checkbox size="sm" label="Small checkbox" checked />
    <Checkbox size="md" label="Medium checkbox" checked />
    <Checkbox size="lg" label="Large checkbox" checked />
    <Checkbox size="xl" label="Extra large checkbox" checked />
  </Stack>
)
