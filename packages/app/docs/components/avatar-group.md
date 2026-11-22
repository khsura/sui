# SAvatarGroup

**Import:** `import { SAvatarGroup } from '@khsura/sui'`

A row of overlapping [`SAvatar`](./avatar.md)s, such as the members of a project. It renders a `<div class="s_avatarGroup" role="group">`. With `max`, it shows the first `max` avatars and one "+N" avatar for the rest.

Live examples: [SAvatarGroup in Storybook](https://sui.surakh.com/?path=/docs/ui-components-avatargroup--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | `undefined` | The most avatars shown; the rest collapse into a "+N" avatar. Shows every avatar when unset |
| `moreLabel` | `string` | `'{count} more'` | Accessible name of the "+N" avatar. `{count}` is replaced with the number of hidden avatars |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra' \| number \| string` | `undefined` | Size of every avatar in the group. An avatar's own `size` wins |
| `color` | `string` | `undefined` | Background color of the "+N" avatar |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold of the "+N" avatar |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override of the "+N" avatar |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | The `SAvatar`s. A `v-for` is counted avatar by avatar |
| `more` | `{ count: number }` | Replaces the "+N" avatar. Only rendered when avatars are hidden |

## Events

None.

## Usage

```vue
<SAvatarGroup :max="3" size="small" color="primary">
  <SAvatar
    v-for="member in members"
    :key="member.id"
    :image="member.photoUrl"
    :text="member.initials"
    :alt="member.name"
  />
</SAvatarGroup>

<!-- A custom "+N" -->
<SAvatarGroup :max="2">
  <SAvatar v-for="member in members" :key="member.id" :text="member.initials" :alt="member.name" />
  <template #more="{ count }">
    <SChip size="small">+{{ count }} others</SChip>
  </template>
</SAvatarGroup>
```

## Accessibility

- The group has `role="group"`. Give it an `aria-label` (such as `aria-label="Project members"`) when nothing near it names it.
- The "+N" avatar has `role="img"` and the accessible name from `moreLabel`, such as "3 more".
- Give each avatar an `alt` with the person's name, since the overlapping avatars show no names.

## Notes

- Put `SAvatar`s directly in the default slot. Do not wrap each one in a `<div>`: the overlap and the `max` count apply to the direct children.
- Use `max` for long lists. Without it, a long group wraps onto more lines instead of overflowing the page.
- Each avatar gets a 2 px ring in the card color, so the overlap reads on any surface.
