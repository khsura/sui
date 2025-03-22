import { faker } from '@khsura/shared'
import { SSlideGroup, SImage, SCard, SSlideItem, useDisplay } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { createStoryObj } from '@khsura/storybook/helpers'

const banners = [
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
  {
    banner: faker.image.url(),
    alt: faker.commerce.productName(),
    url: faker.internet.url(),
  },
]

const slideGroup: Meta<typeof SSlideGroup> = {
  title: 'UI Components/SlideGroup',
  argTypes: {
    scrollable: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
    },
    slideStep: {
      type: 'number',
      description: 'if slideStep is not set, it will use width of the whole slide wrapper',
      table: {
        defaultValue: {
          summary: 'null',
        },
      },
      control: {
        type: 'number',
      },
    },
  },
}

export default slideGroup

export const SlideGroup = createStoryObj<typeof SSlideGroup>({
  render: (args) => {
    return {
      components: { SSlideGroup, SImage, SSlideItem },
      setup() {
        const { smAndUp } = useDisplay()

        return {
          banners,
          smAndUp,
          args,
        }
      },
      template: /* html */ `
      <div>
        <SSlideGroup v-bind="args">
          <SSlideItem
            v-for="(item, index) in banners"
            :key="index"
            :index="index"
          >
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SImage
                :src="item.banner"
                :url="item.url"
                object-fit="cover"
                :height="120"
                :width="100 + 70 * Math.random()"
              ></SImage>
            </a>
          </SSlideItem> 
        </SSlideGroup>
        <SSlideGroup v-bind="args" class="s_mt__5">
          <SSlideItem
            v-for="(item, index) in banners"
            :key="index"
            :index="index"
          >
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SImage
                :src="item.banner"
                :url="item.url"
                object-fit="cover"
                :height="200"
                :width="200"
              ></SImage>
            </a>
          </SSlideItem> 
        </SSlideGroup>
      </div>
    `,
    }
  },
  args: {
    activeClass: '',
    centerActive: false,
    mandatory: false,
    multiple: false,
    slideStep: null,
  },
})

export const SlideGroupWithButtons = createStoryObj<typeof SSlideGroup>({
  render: (args) => {
    return {
      components: { SSlideGroup, SImage, SSlideItem, SCard },
      setup() {
        const { smAndUp } = useDisplay()

        return {
          banners: banners.slice(0, 5),
          smAndUp,
          args,
        }
      },
      template: /* html */ `
        <SSlideGroup v-bind="args">
          <SSlideItem
            v-for="i in 12"
            :key="i"
            :index="i"
            class="s_pa__2"
          >
            <template #default="{ isSelected }">
              <SCard width="100" height="100" :color="isSelected ? 'primary' : null" style="display: flex; align-items: center; justify-content: center;">
                <span class="s_text--h5">{{i}}</span>
              </SCard>
            </template>
          </SSlideItem> 
        </SSlideGroup>
      `,
    }
  },
  args: {
    activeClass: '',
    centerActive: false,
    mandatory: false,
    multiple: false,
    slideStep: null,
  },
})

export const SlideGroupWithFewItems = createStoryObj<typeof SSlideGroup>({
  render: (args) => {
    return {
      components: { SSlideGroup, SImage, SSlideItem },
      setup() {
        const { smAndUp } = useDisplay()

        return {
          banners: banners.slice(0, 5),
          smAndUp,
          args,
        }
      },
      template: /* html */ `
        <SSlideGroup v-bind="args">
          <SSlideItem
            v-for="(item, index) in banners"
            :key="index"
            :index="index"
          >
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SImage
                :src="item.banner"
                :url="item.url"
                object-fit="cover"
                :height="120"
                :width="100 + 70 * Math.random()"
              ></SImage>
            </a>
          </SSlideItem> 
        </SSlideGroup>
        `,
    }
  },
  args: {
    activeClass: '',
    centerActive: false,
    mandatory: false,
    multiple: false,
    slideStep: null,
  },
})
