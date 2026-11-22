import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { expect, waitFor } from 'storybook/test'
import {
  SAvatar,
  SCard,
  SCardSubtitle,
  SCardText,
  SCardTitle,
  SChip,
  SList,
  SListItem,
  SListItemContent,
  SListItemSubtitle,
  SListItemTitle,
} from '@/app/index'
import { argTypesBorder, argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const avatar: Meta<typeof SAvatar> = {
  title: 'UI Components/Avatar',
  component: SAvatar,
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    borderRadius: argTypesBorder.borderRadius,
    outlined: argTypesBorder.outlined,
  },
}

export default avatar

// A local image, so the screenshots do not depend on the network.
const createImage = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/></svg>`,
  )}`

const image = createImage('#1e3c72', '#2a5298')
// Not a valid image, so it fires `error` at once and the avatar falls back.
const brokenImage = 'data:image/png;base64,AAAA'

export const Avatar = createStoryObj<typeof SAvatar>({
  args: {
    image: undefined,
    alt: 'Jane Doe',
    text: 'JD',
    icon: undefined,
    color: 'primary',
    size: null,
    borderRadius: null,
    outlined: false,
  },
  render: (args) =>
    defineComponent({
      components: { SAvatar },
      setup() {
        return { args }
      },
      template: /* html */ `<SAvatar v-bind="args"></SAvatar>`,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const sizes = ['mini', 'small', 'default', 'large', 'extra'] as const

// Stress cases in one story, so the visual harness stays fast: every size with an image, initials and an icon,
// a broken image that must fall back to the initials or the icon, a full name passed as `text`, the shapes,
// colours, a custom numeric size, and a narrow flex column.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const AvatarStress = {
  tags: ['visual'],
  render: () => ({
    components: { SAvatar },
    setup() {
      return { sizes, image, brokenImage }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px; max-width: 375px">
        <div v-for="size in sizes" :key="size" style="display: flex; align-items: center; gap: 8px" data-test="size-row">
          <SAvatar :size="size" :image="image" alt="Jane Doe"></SAvatar>
          <SAvatar :size="size" text="JD" color="primary"></SAvatar>
          <SAvatar :size="size"></SAvatar>
          <SAvatar :size="size" :image="brokenImage" text="AB" color="success" data-test="fallback-text"></SAvatar>
          <SAvatar :size="size" :image="brokenImage" data-test="fallback-icon"></SAvatar>
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <SAvatar text="Jane Alexandra Doe-Smithson" color="secondary" data-test="long-text"></SAvatar>
          <SAvatar text="JD" border-radius="tile" color="error"></SAvatar>
          <SAvatar text="JD" border-radius="rounded" color="warning"></SAvatar>
          <SAvatar text="JD" outlined color="primary"></SAvatar>
          <SAvatar icon="mdi-domain" outlined></SAvatar>
          <SAvatar :size="64" text="XL" color="info" data-test="custom-size"></SAvatar>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px; width: 120px">
          <SAvatar :image="image" alt="Jane Doe"></SAvatar>
          <SAvatar text="JD" color="primary"></SAvatar>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement

    await waitFor(() => expect(canvasElement.querySelectorAll('.s_avatar').length).toBeGreaterThan(0))
    // A broken image falls back to the initials, or to the icon without them.
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-test="fallback-text"] img').length).toBe(0))
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-test="fallback-icon"] img').length).toBe(0))

    for (const fallback of canvasElement.querySelectorAll('[data-test="fallback-text"]')) {
      await expect(fallback.textContent.trim()).toBe('AB')
    }

    for (const fallback of canvasElement.querySelectorAll('[data-test="fallback-icon"]')) {
      await expect(fallback.querySelector('.s_avatar__icon')).not.toBeNull()
    }

    // Every avatar is a square that does not grow with its content.
    for (const avatarElement of canvasElement.querySelectorAll<HTMLElement>('.s_avatar')) {
      const box = avatarElement.getBoundingClientRect()

      await expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(pixelTolerance)
    }

    const customSize = canvasElement.querySelector<HTMLElement>('[data-test="custom-size"]')

    await expect(customSize?.getBoundingClientRect().width).toBeCloseTo(64, 0)
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SAvatar>

// An avatar as the leading item of a list item, a chip (every chip size) and a card title.
export const AvatarInContext = {
  tags: ['visual'],
  render: () => ({
    components: {
      SAvatar,
      SCard,
      SCardSubtitle,
      SCardText,
      SCardTitle,
      SChip,
      SList,
      SListItem,
      SListItemContent,
      SListItemSubtitle,
      SListItemTitle,
    },
    setup() {
      return { sizes, image }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px; max-width: 375px">
        <SList>
          <SListItem data-test="list-item">
            <SAvatar :image="image" alt="Jane Doe"></SAvatar>
            <SListItemContent>
              <SListItemTitle>Jane Doe</SListItemTitle>
              <SListItemSubtitle>Product designer</SListItemSubtitle>
            </SListItemContent>
          </SListItem>
          <SListItem data-test="list-item">
            <SAvatar text="BM" color="primary"></SAvatar>
            <SListItemContent>
              <SListItemTitle>Bat-Erdene Munkhbayar with a long name that wraps</SListItemTitle>
            </SListItemContent>
          </SListItem>
        </SList>
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
          <SChip v-for="size in sizes" :key="size" :size="size" data-test="chip">
            <SAvatar text="JD" color="primary"></SAvatar>
            {{ size }}
          </SChip>
          <SChip color="primary" data-test="chip">
            <SAvatar :image="image" alt="Jane Doe"></SAvatar>
            Jane Doe
          </SChip>
        </div>
        <SCard>
          <SCardTitle data-test="card-title">
            <SAvatar :image="image" alt="Jane Doe"></SAvatar>
            Jane Doe
          </SCardTitle>
          <SCardSubtitle>Posted 2 hours ago</SCardSubtitle>
          <SCardText>Avatars sit at the start of the title and keep their size.</SCardText>
        </SCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement

    await waitFor(() => expect(canvasElement.querySelectorAll('.s_avatar').length).toBeGreaterThan(0))

    // In a chip the avatar fits inside the chip with an inset on each side.
    for (const chip of canvasElement.querySelectorAll<HTMLElement>('[data-test="chip"]')) {
      const chipBox = chip.getBoundingClientRect()
      const avatarElement = chip.querySelector('.s_avatar')

      await expect(avatarElement).not.toBeNull()

      const avatarBox = avatarElement?.getBoundingClientRect() ?? new DOMRect()

      await expect(avatarBox.height).toBeLessThan(chipBox.height)
      await expect(avatarBox.top).toBeGreaterThanOrEqual(chipBox.top - pixelTolerance)
      await expect(avatarBox.bottom).toBeLessThanOrEqual(chipBox.bottom + pixelTolerance)
      await expect(avatarBox.left).toBeGreaterThanOrEqual(chipBox.left - pixelTolerance)
    }

    // In a list item and a card title the avatar keeps its full size and does not shrink.
    for (const host of canvasElement.querySelectorAll<HTMLElement>(
      '[data-test="list-item"], [data-test="card-title"]',
    )) {
      const avatarBox = host.querySelector('.s_avatar')?.getBoundingClientRect()

      await expect(avatarBox?.width).toBeCloseTo(40, 0)
      await expect(avatarBox?.height).toBeCloseTo(40, 0)
    }

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SAvatar>
