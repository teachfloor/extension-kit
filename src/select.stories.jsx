import React from 'react'

import { Stack } from '@teachfloor/ui-kit'
import { Select } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Select',
  component: Select,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Select
    label="Your favorite framework/library"
    placeholder="Pick one"
    data={[
      { value: 'react', label: 'React' },
      { value: 'ng', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'vue', label: 'Vue' },
    ]}
    withinPortal
  />
);

export const Searchable = () => (
  <Select
    label="Your favorite framework/library"
    placeholder="Pick one"
    searchable
    nothingFound="No options"
    data={['React', 'Angular', 'Svelte', 'Vue']}
    withinPortal
  />
);

export const Clearable = () => (
  <Select
    label="Your favorite framework/library"
    placeholder="Pick one"
    clearable
    nothingFound="No options"
    data={['React', 'Angular', 'Svelte', 'Vue']}
    withinPortal
  />
);

export const GroupingItems = () => (
  <Select
    label="Your favorite Rick and Morty character"
    placeholder="Pick one"
    data={[
      { value: 'rick', label: 'Rick', group: 'Used to be a pickle' },
      { value: 'morty', label: 'Morty', group: 'Never was a pickle' },
      { value: 'beth', label: 'Beth', group: 'Never was a pickle' },
      { value: 'summer', label: 'Summer', group: 'Never was a pickle' },
    ]}
    withinPortal
  />
);
