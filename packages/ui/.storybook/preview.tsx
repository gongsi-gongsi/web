import type { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import React from 'react'
import { ThemeProvider } from '../src/providers/theme-provider'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      disable: true
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light'
    }),
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="min-h-screen bg-background text-foreground p-4">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
}

export default preview
