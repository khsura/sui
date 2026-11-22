import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { waitFor } from 'storybook/test'
import { SButton, SSkeletonLoader } from '@/app/index'
import { argTypesComponentTheme, argTypesMeasurableStyles, argTypesSkeletonLoader } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const skeletonLoader: Meta<typeof SSkeletonLoader> = {
  title: 'UI Components/SkeletonLoader',
  component: SSkeletonLoader,
  argTypes: {
    ...argTypesSkeletonLoader,
    ...argTypesComponentTheme,
    ...argTypesMeasurableStyles,
  },
}

export default skeletonLoader

export const SkeletonLoader = createStoryObj<typeof SSkeletonLoader>({
  args: {
    type: 'avatar, text@3',
    loading: true,
    boilerplate: false,
    loadingText: 'Loading…',
    theme: undefined,
    maxWidth: 480,
  },
  render: (args) =>
    defineComponent({
      components: { SSkeletonLoader },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SSkeletonLoader v-bind="args">
          <p>Loaded content replaces the skeleton once <code>loading</code> is false.</p>
        </SSkeletonLoader>
      `,
    }),
})

// Toggle `loading` to swap the skeleton for the real content.
export const LoadingToggle = createStoryObj<typeof SSkeletonLoader>({
  render: () =>
    defineComponent({
      components: { SButton, SSkeletonLoader },
      setup() {
        return { isLoading: ref(true) }
      },
      template: /* html */ `
        <div style="max-width: 480px">
          <SButton class="s_mb__4" @click="isLoading = !isLoading">{{ isLoading ? 'Finish loading' : 'Load again' }}</SButton>
          <SSkeletonLoader type="heading, text@3" :loading="isLoading">
            <h3>Order #1024</h3>
            <p>Three items, shipped on Monday.</p>
          </SSkeletonLoader>
        </div>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
// The phone width every skeleton in the frame must fit without scrolling sideways.
const phoneWidth = 375
// The standard SAvatar size the avatar bone must match, so swapping in the avatar does not move the layout.
const avatarSize = 40
// STable's row height the table-row bone must match.
const tableRowHeight = 48
const presets = ['text', 'heading', 'avatar', 'button', 'image', 'card', 'list-item', 'list-item-avatar', 'table-row']

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getRect = (element: Element | null | undefined) => {
  if (!element) {
    throw new Error('element not found')
  }

  return element.getBoundingClientRect()
}

// The cases AI code gets wrong: every preset on a phone, a composed type string, a skeleton in a flex row beside
// a label (where 100%-wide bones collapse to nothing), a table that must not overflow, still bones, the dark theme,
// and content swapped in once loaded.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const SkeletonLoaderStress = {
  tags: ['visual'],
  render: () => ({
    components: { SSkeletonLoader },
    setup() {
      return { phoneWidth, presets }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-wrap: wrap; gap: 16px">
        <div class="stress-phone" :style="{ width: phoneWidth + 'px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '16px', outline: '1px dashed currentColor' }">
          <SSkeletonLoader v-for="preset in presets" :key="preset" :type="preset" :class="'stress-' + preset"></SSkeletonLoader>
        </div>
        <div class="stress-phone" :style="{ width: phoneWidth + 'px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '16px', outline: '1px dashed currentColor' }">
          <SSkeletonLoader type="avatar, text@3" class="stress-composed"></SSkeletonLoader>
          <div style="display: flex; align-items: center; gap: 8px">
            <span>Status</span>
            <SSkeletonLoader type="text" class="stress-flex-row"></SSkeletonLoader>
          </div>
          <SSkeletonLoader type="table" class="stress-table"></SSkeletonLoader>
          <SSkeletonLoader type="list-item-avatar@2" boilerplate></SSkeletonLoader>
          <div class="s_dark" style="padding: 8px; background: var(--s-app-color-card--dark)">
            <SSkeletonLoader type="list-item-avatar, button" theme="dark" class="stress-dark"></SSkeletonLoader>
          </div>
          <SSkeletonLoader type="card" :loading="false" class="stress-loaded">
            <p class="stress-content">Loaded content</p>
          </SSkeletonLoader>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement
    const frames = [...canvasElement.querySelectorAll('.stress-phone')]

    await waitFor(() => {
      assertThat(root.scrollWidth <= root.clientWidth + pixelTolerance, 'the page scrolls sideways')

      for (const frame of frames) {
        const frameRect = getRect(frame)

        for (const bone of frame.querySelectorAll('.s_skeletonLoader__bone')) {
          const rect = getRect(bone)
          const name = bone.className

          assertThat(rect.width > 0 && rect.height > 0, `bone "${name}" collapsed to ${rect.width}x${rect.height}`)
          assertThat(
            rect.left >= frameRect.left - pixelTolerance && rect.right <= frameRect.right + pixelTolerance,
            `bone "${name}" overflows the ${phoneWidth}px frame`,
          )
        }
      }

      const avatar = getRect(canvasElement.querySelector('.stress-avatar .s_skeletonLoader__avatar'))

      assertThat(
        Math.abs(avatar.width - avatarSize) <= pixelTolerance && Math.abs(avatar.height - avatarSize) <= pixelTolerance,
        `the avatar bone is ${avatar.width}x${avatar.height}, not ${avatarSize}x${avatarSize}`,
      )

      const tableRow = getRect(canvasElement.querySelector('.stress-table-row .s_skeletonLoader__tableRow'))

      assertThat(
        Math.abs(tableRow.height - tableRowHeight) <= pixelTolerance,
        `the table row is ${tableRow.height}px, not ${tableRowHeight}px`,
      )

      const composed = canvasElement.querySelector('.stress-composed')

      assertThat(composed?.querySelectorAll('.s_skeletonLoader__text').length === 3, '"text@3" did not draw 3 lines')
      assertThat(composed?.getAttribute('role') === 'status', 'the loading skeleton has no status role')
      assertThat(
        composed?.querySelector('.s_skeletonLoader__bones')?.getAttribute('aria-hidden') === 'true',
        'the bones are not hidden from screen readers',
      )

      const loaded = canvasElement.querySelector('.stress-loaded')

      assertThat(!!loaded?.querySelector('.stress-content'), 'the loaded skeleton does not show its content')
      assertThat(!loaded?.querySelector('.s_skeletonLoader__bone'), 'the loaded skeleton still draws bones')
    })
  },
} satisfies StoryObj<typeof SSkeletonLoader>
