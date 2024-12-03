import React from 'react'
import { ExtensionContextProvider } from '/src'

export const decorators = [
  (renderStory) => <ExtensionContextProvider>{renderStory()}</ExtensionContextProvider>
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