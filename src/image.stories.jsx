import React from 'react'

import { Group } from '@teachfloor/ui-kit'
import { Image, Text } from './'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'Image',
  component: Image,

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
  <Image mx="auto" radius="md" src="https://picsum.photos/320/320" alt="Random image" />
);

export const Dimensions = () => (
  <Group>
    {/* By default image will have object-fit: cover */}
    <Image width={200} height={80} src="https://picsum.photos/320/320" />

    {/* Set fit="contain" to preserve image proportions in this case image wrapper will still have given width and height */}
    <Image width={200} height={80} fit="contain" src="https://picsum.photos/320/320" />

    {/* It's not necessary to use both width and height */}
    <Image height={80} src="https://picsum.photos/320/320" />
  </Group>
);

export const Placeholders = () => (
  <Group>
    <Image width={200} height={120} src={null} alt="With default placeholder" withPlaceholder />

    <Image
      height={120}
      width={200}
      src="42.png"
      alt="With custom placeholder"
      withPlaceholder
      placeholder={<Text align="center">This image contained the meaning of life</Text>}
    />
  </Group>
);

export const WithCaption = () => (
  <Image
    radius="md"
    src="https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
    alt="Random unsplash image"
    caption="My dog begging for treats"
  />
);
