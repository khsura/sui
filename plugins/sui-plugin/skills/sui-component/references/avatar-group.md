# SAvatarGroup

**Import:** `import { SAvatarGroup } from '@khsura/sui'`

A row of overlapping `SAvatar`s, such as project members (`role="group"`). With `max`, it shows the first `max` avatars and one "+N" avatar for the rest. See [avatar.md](avatar.md) for the avatar itself.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAvatarGroup.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-avatargroup--docs

<!-- generated:api:start SAvatarGroup -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAvatarGroup props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `max` | `number` | — | no | — | The most avatars shown. The rest collapse into one "+N" avatar. Shows every avatar when unset. |
| `moreLabel` | `string` | — | no | — | Accessible name of the "+N" avatar. `{count}` is replaced with the number of hidden avatars. Defaults to `{count} more`. |
| `size` | `SizePropertyUnionType` | — | no | — | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |

**SAvatarGroup slots**

| Slot | Slot props |
| --- | --- |
| `default` | `any` |
| `more` | `{ count: number; }` |

**SAvatarGroup events**

None.

<!-- generated:api:end SAvatarGroup -->

**SAvatarGroup notes**

- `size` applies to every avatar that has no `size` of its own.
- `color`, `colorThreshold` and `theme` style the "+N" avatar.
- `more` slot (`{ count }`) replaces the "+N" avatar.
- Without `max`, a long group wraps onto more lines instead of overflowing.

## Usage

```vue
<SAvatarGroup :max="3" size="small" color="primary" aria-label="Project members">
  <SAvatar
    v-for="member in members"
    :key="member.id"
    :image="member.photoUrl"
    :text="member.initials"
    :alt="member.name"
  />
</SAvatarGroup>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SAvatarGroup><div v-for="m in members"><SAvatar … /></div></SAvatarGroup>` (no overlap) | `<SAvatarGroup><SAvatar v-for="m in members" :key="m.id" … /></SAvatarGroup>` |
| `members.slice(0, 3)` plus a hand-made "+N" element | `<SAvatarGroup :max="3">` with every member |
| A tooltip around each avatar in the group | Wrap the whole group, or show the names in a list |
| `<SAvatar>` without `alt` in a group (names are not visible) | `:alt="member.name"` on each avatar |
