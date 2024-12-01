import React from 'react'

import { Stack } from '@teachfloor/ui-kit'
import { NumberInput } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'NumberInput',
  component: NumberInput,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Stack w={360}>
    <NumberInput
      defaultValue={18}
      placeholder="Your age"
      label="Your age"
      withAsterisk
    />
  </Stack>
);

export const ParserAndFormatter = () => (
  <Stack w={360}>
    <NumberInput
      label="Price"
      defaultValue={1000}
      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
      formatter={(value) =>
        !Number.isNaN(parseFloat(value))
          ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          : '$ '
      }
    />
  </Stack>
);

export const MinMaxAndSteps = () => (
  <Stack w={360}>
    <NumberInput
      label="Your age"
      description="From 0 to 120, step is 1"
      placeholder="Your age"
      max={120}
      min={0}
    />

    <NumberInput
      label="Your weight in kg"
      description="From 0 to Infinity, step is 5"
      defaultValue={80}
      step={5}
      min={0}
    />
  </Stack>
);

export const DecimalSteps = () => (
  <Stack w={360}>
    <NumberInput
      label="Number input with decimal steps"
      defaultValue={0.05}
      precision={2}
      min={-1}
      step={0.05}
      max={1}
    />
  </Stack>
);

