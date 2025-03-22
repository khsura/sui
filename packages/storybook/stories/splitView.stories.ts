import { faker } from '@khsura/shared'
import { SSplitView, SSplitViewItem } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { createStoryObj } from '@khsura/storybook/helpers'

type SplitStoryType = typeof SSplitView | typeof SSplitViewItem | { views: number }

const splitView: Meta<SplitStoryType> = {
  title: 'UI Components/SplitView',
  argTypes: {
    vertical: {
      control: { type: 'boolean' },
    },
    height: {
      control: { type: 'number' },
    },
    width: {
      control: { type: 'number' },
    },
    views: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
    },
  },
}

export default splitView

export const SplitView = createStoryObj<typeof splitView>({
  render: (args) => {
    return {
      components: { SSplitView, SSplitViewItem },
      setup() {
        const createLorem = () => {
          return faker.lorem.paragraphs()
        }

        return { args, createLorem }
      },
      template: `
      <SSplitView v-bind="args">
        <SSplitViewItem v-for="i in args.views" :key="i">
          <div v-html="createLorem()"></div>
        </SSplitViewItem>
      </SSplitView>`,
    }
  },
  args: {
    vertical: false,
    height: '400px',
    views: 3,
  },
})
