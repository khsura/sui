import { type StoryObj } from '@storybook/vue3'
import { type Component } from 'vue'

export const createStoryObj = <T extends Component>(storyObj: StoryObj<T>) => {
  return storyObj
}
