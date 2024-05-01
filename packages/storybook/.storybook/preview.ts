import './previewPlugins'
import { getBrowserTheme } from '@sui/app/helpers'
import { themes } from '@storybook/theming'
import { type Preview } from '@storybook/vue3'
import { themeComponents } from './components'
import { withTheme } from './decorators/withTheme'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
    // @storybook/theming config
    docs: {
      theme: themes.light,
      components: themeComponents,
    },
    // storybook-dark-mode config
    darkMode: {
      current: getBrowserTheme(),
      dark: { ...themes.dark },
      light: { ...themes.light },
    },
  },
  decorators: [withTheme()],
}

export default preview
