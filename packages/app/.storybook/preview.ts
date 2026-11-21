import './previewPlugins'
import { faker } from '@khsura/shared'
import { themes } from 'storybook/theming'
import { type Preview } from '@storybook/vue3-vite'
import { storyFakerRefDate, storyFakerSeed } from './constants'
import { appDecorator } from './decorators'
import { AppTheme, getBrowserTheme } from '@/app/index'

faker.seed(storyFakerSeed)
faker.setDefaultRefDate(storyFakerRefDate)

const preview: Preview = {
  decorators: [appDecorator()],
  globalTypes: {
    theme: {
      description: 'SUI theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: AppTheme.light, title: 'Light', icon: 'sun' },
          { value: AppTheme.dark, title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: AppTheme.light,
  },
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
        order: [
          'Introduction',
          'AI',
          'Features',
          'Styles & Animations',
          'UI Directives',
          'UI Components',
          'Components',
        ],
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
