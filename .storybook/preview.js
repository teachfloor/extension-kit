import React from 'react'
import { TeachfloorProvider } from '@teachfloor/ui-kit'

export const decorators = [
  (renderStory) => <TeachfloorProvider>{renderStory()}</TeachfloorProvider>
]

export const parameters = {
  layout: 'centered',
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Core', 'Components', '*'],
    },
  },
  backgrounds: {
    default: 'light',
    grid: {
      disable: true,
    }
  },
}