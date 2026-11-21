import { faker } from '@khsura/shared'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { userEvent, waitFor } from 'storybook/test'
import { SButton, SCard, SCardText, SIcon, SImage, SSlideGroup, SSlideItem, useDisplay } from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'

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
  // axe audits every story of this component in CI (keyboard-driven component without a screenshot)
  tags: ['a11y'],
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
              :aria-label="'Banner ' + (index + 1)"
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
              :aria-label="'Banner ' + (index + 1)"
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
              :aria-label="'Banner ' + (index + 1)"
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

const edgeSlideCount = 14
// Enough clicks to cross the widest row; a row that never reaches its edge fails instead of looping.
const maxNavigatorClicks = 20

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getNavigatorButtons = (group: Element) => {
  const [previousButton, nextButton] = group.querySelectorAll<HTMLButtonElement>('.s_slideGroup__navigator button')

  if (!previousButton || !nextButton) {
    throw new Error('slide group navigator buttons not found')
  }

  return { previousButton, nextButton }
}

const assertAtStart = (group: Element, label: string) => {
  const { previousButton, nextButton } = getNavigatorButtons(group)

  assertThat(previousButton.disabled, `${label}: the left arrow is enabled at the start`)
  assertThat(!nextButton.disabled, `${label}: the right arrow is disabled at the start`)
}

const assertAtEnd = (group: Element, label: string) => {
  const { previousButton, nextButton } = getNavigatorButtons(group)

  assertThat(!previousButton.disabled, `${label}: the left arrow is disabled at the end`)
  assertThat(nextButton.disabled, `${label}: the right arrow is enabled at the end`)
}

// Clicks one arrow until it disables itself, waiting out each slide animation (both arrows disable while it runs).
const clickUntilDisabled = async (group: Element, pickButton: (group: Element) => HTMLButtonElement) => {
  for (let click = 0; click < maxNavigatorClicks && !pickButton(group).disabled; click++) {
    await userEvent.click(pickButton(group))
    await waitFor(() => {
      const { previousButton, nextButton } = getNavigatorButtons(group)

      assertThat(!previousButton.disabled || !nextButton.disabled, 'the slide animation has not finished')
    })
  }
}

// Each arrow must be disabled only at its own edge, for the built-in arrows and for arrows passed through the
// `left` / `right` slots (their `attrs.disabled`). The play function scrolls to the right end and back, so the
// screenshot shows the start position.
export const SlideGroupEdges = {
  tags: ['visual'],
  render: () => ({
    components: { SButton, SCard, SCardText, SIcon, SSlideGroup, SSlideItem },
    setup: () => ({ slides: Array.from({ length: edgeSlideCount }, (_, index) => `Slide ${index + 1}`) }),
    template: /* html */ `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <SSlideGroup class="stress-slide-default" :scrollable="false">
          <SSlideItem v-for="(slide, index) in slides" :key="slide" :index="index">
            <SCard outlined :width="120"><SCardText>{{ slide }}</SCardText></SCard>
          </SSlideItem>
        </SSlideGroup>
        <SSlideGroup class="stress-slide-slots" :scrollable="false">
          <template #left="{ attrs, on }">
            <SButton variant="icon" aria-label="Previous slides" v-bind="attrs" v-on="on">
              <SIcon icon="mdi-arrow-left"></SIcon>
            </SButton>
          </template>
          <SSlideItem v-for="(slide, index) in slides" :key="slide" :index="index">
            <SCard outlined :width="120"><SCardText>{{ slide }}</SCardText></SCard>
          </SSlideItem>
          <template #right="{ attrs, on }">
            <SButton variant="icon" aria-label="Next slides" v-bind="attrs" v-on="on">
              <SIcon icon="mdi-arrow-right"></SIcon>
            </SButton>
          </template>
        </SSlideGroup>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const groups = [
      { label: 'built-in arrows', selector: '.stress-slide-default' },
      { label: 'slot arrows', selector: '.stress-slide-slots' },
    ]

    for (const { label, selector } of groups) {
      const group = canvasElement.querySelector(selector)

      if (!group) {
        throw new Error(`${label}: slide group not found`)
      }

      await waitFor(() => assertAtStart(group, label))
      await clickUntilDisabled(group, (element) => getNavigatorButtons(element).nextButton)
      await waitFor(() => assertAtEnd(group, label))
      await clickUntilDisabled(group, (element) => getNavigatorButtons(element).previousButton)
      await waitFor(() => assertAtStart(group, label))
    }
  },
} satisfies StoryObj
