import React from 'react'

import { Stack } from '@teachfloor/ui-kit'
import { ColorInput } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'ColorInput',
  component: ColorInput,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

export const Example = () => (
  <Stack w={360}>
    <ColorInput placeholder="Pick color" label="Your favorite color" />
  </Stack>
);

export const WithSwatches = () => (
  <Stack w={360}>
    <ColorInput
      format="hex"
      swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
    />
  </Stack>
);
