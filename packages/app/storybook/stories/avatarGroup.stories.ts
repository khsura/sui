import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { expect, waitFor } from 'storybook/test'
import { SAvatar, SAvatarGroup } from '@/app/index'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const avatarGroup: Meta<typeof SAvatarGroup> = {
  title: 'UI Components/AvatarGroup',
  component: SAvatarGroup,
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    max: { control: { type: 'number', min: 0 } },
  },
}

export default avatarGroup

const people = [
  { name: 'Jane Doe', initials: 'JD', color: 'primary' },
  { name: 'Bat-Erdene Munkhbayar', initials: 'BM', color: 'secondary' },
  { name: 'Sara Kim', initials: 'SK', color: 'success' },
  { name: 'Oyun Tsetseg', initials: 'OT', color: 'warning' },
  { name: 'Alex Morgan', initials: 'AM', color: 'error' },
  { name: 'Nomin Erdene', initials: 'NE', color: 'info' },
]

export const AvatarGroup = createStoryObj<typeof SAvatarGroup>({
  args: {
    max: 3,
    moreLabel: undefined,
    color: undefined,
    size: null,
  },
  render: (args) =>
    defineComponent({
      components: { SAvatar, SAvatarGroup },
      setup() {
        return { args, people }
      },
      template: /* html */ `
        <SAvatarGroup v-bind="args">
          <SAvatar v-for="person in people" :key="person.name" :text="person.initials" :alt="person.name" :color="person.color"></SAvatar>
        </SAvatarGroup>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const sizes = ['mini', 'small', 'default', 'large', 'extra'] as const
const manyPeople = Array.from({ length: 4 }, () => people).flat()

// Stress cases in one story: `max` with "+N" at every size, `max` larger than the number of avatars,
// a custom "+N" label and colour, and a long group without `max` at 375 px, which must wrap instead of
// overflowing the page.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const AvatarGroupStress = {
  tags: ['visual'],
  render: () => ({
    components: { SAvatar, SAvatarGroup },
    setup() {
      return { sizes, people, manyPeople }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px; max-width: 375px">
        <SAvatarGroup v-for="size in sizes" :key="size" :size="size" :max="3" data-test="limited">
          <SAvatar v-for="person in people" :key="person.name" :text="person.initials" :alt="person.name" :color="person.color"></SAvatar>
        </SAvatarGroup>
        <SAvatarGroup :max="10" data-test="unlimited">
          <SAvatar v-for="person in people" :key="person.name" :text="person.initials" :alt="person.name" :color="person.color"></SAvatar>
        </SAvatarGroup>
        <SAvatarGroup :max="2" color="primary" more-label="{count} more people" data-test="custom-more">
          <SAvatar v-for="person in people" :key="person.name" :text="person.initials" :alt="person.name"></SAvatar>
        </SAvatarGroup>
        <SAvatarGroup data-test="long">
          <SAvatar v-for="(person, index) in manyPeople" :key="index" :text="person.initials" :alt="person.name" :color="person.color"></SAvatar>
        </SAvatarGroup>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement

    await waitFor(() => expect(canvasElement.querySelectorAll('.s_avatarGroup').length).toBeGreaterThan(0))

    for (const group of canvasElement.querySelectorAll('[data-test="limited"]')) {
      const avatars = group.querySelectorAll('.s_avatar')

      // 3 avatars plus the "+3" avatar.
      await expect(avatars.length).toBe(4)
      await expect(avatars[3].textContent.trim()).toBe('+3')
      await expect(avatars[3].getAttribute('aria-label')).toBe('3 more')
    }

    await expect(canvasElement.querySelectorAll('[data-test="unlimited"] .s_avatar').length).toBe(people.length)
    await expect(
      canvasElement.querySelector('[data-test="custom-more"] .s_avatarGroup__more')?.getAttribute('aria-label'),
    ).toBe('4 more people')

    // The avatars overlap: each one starts before the previous one ends.
    const limitedAvatars = canvasElement.querySelectorAll('[data-test="limited"]')[2].querySelectorAll('.s_avatar')

    await expect(limitedAvatars[1].getBoundingClientRect().left).toBeLessThan(
      limitedAvatars[0].getBoundingClientRect().right,
    )

    const longGroup = canvasElement.querySelector<HTMLElement>('[data-test="long"]')

    await expect(longGroup?.scrollWidth).toBeLessThanOrEqual((longGroup?.clientWidth ?? 0) + pixelTolerance)

    // A wrapped line starts flush with the first one, not sticking out to the left of the group.
    const groupLeft = longGroup?.getBoundingClientRect().left ?? 0

    for (const avatarElement of longGroup?.querySelectorAll('.s_avatar') ?? []) {
      await expect(avatarElement.getBoundingClientRect().left).toBeGreaterThanOrEqual(groupLeft - pixelTolerance)
    }

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SAvatarGroup>
