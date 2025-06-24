import './previewPlugins'
import { getBrowserTheme } from '@khsura/sui/index'
import { themes } from 'storybook/theming'
import { type Preview } from '@storybook/vue3-vite'
import { appDecorator } from './decorators'

const preview: Preview = {
  decorators: [appDecorator()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Features', 'Styles & Animations', 'UI Directives', 'UI Components', 'Components'],
      },
    },
    darkMode: {
      current: getBrowserTheme(),
      dark: { ...themes.dark },
      light: { ...themes.normal },
    },
  },
  tags: ['autodocs'],
}

export default preview
