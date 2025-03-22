import { faker } from '@khsura/shared'
import { SCarousel, SCarouselItem, SRow } from '@khsura/sui'
import type { GroupItemValue } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const carousel: Meta<typeof SCarousel> = {
  title: 'UI Components/Carousel',
  component: SCarousel,
  argTypes: {
    nextIcon: {
      type: 'string',
    },
    prevIcon: {
      type: 'string',
    },
    delimiterIcon: {
      type: 'string',
    },
    tag: {
      type: 'string',
    },
  },
}

export default carousel

export const Carousel = createStoryObj<typeof SCarousel>({
  args: {
    nextIcon: undefined,
    prevIcon: undefined,
    hideArrows: false,
    color: '#0071eb',
    controlsBackgroundColor: '',
    touch: undefined,
    noAnimation: false,
    selectedClass: 's_windowItem--active',
    tag: undefined,
    cycle: true,
    delimiterIcon: undefined,
    height: 500,
    hideDelimiters: false,
    hideDelimiterBackground: false,
    interval: 4000,
  },
  render: (args) => {
    return {
      components: { SCarousel, SCarouselItem, SRow },
      setup() {
        const title = ref(faker.word.words({ count: { min: 1, max: 10 } }).replace(/\s/g, ''))
        const items = faker.helpers.uniqueArray(faker.image.urlLoremFlickr, 4) as GroupItemValue[]

        return {
          args,
          title,
          items,
        }
      },
      template: `
        <SCarousel v-bind="args">
          <SCarouselItem v-for="(item, id) in items" :key="id" :value="id" :src="item">
            <SRow fill-height align="center" class="s_pl__10 k_text--h4 k_fontWeight__bold k_textShadow__2" style="color: white; text-transform: uppercase">
              {{ title }}
            </SRow>
          </SCarouselItem>
        </SCarousel>
      `,
    }
  },
})
