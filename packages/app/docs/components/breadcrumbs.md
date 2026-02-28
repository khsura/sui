# SBreadcrumbs

**Import:** `import { SBreadcrumbs } from '@khsura/sui'`

Navigation trail showing the current page's location in a hierarchy.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbsItem[]` | `[]` | Array of breadcrumb entries |
| `divider` | `string` | `'/'` | Separator character between items |
| `large` | `boolean` | `false` | Larger text size |
| `color` | `string` | `undefined` | Link color |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |

### BreadcrumbsItem shape

```typescript
type BreadcrumbsItem = {
  text: string        // Display label
  to?: RouteLocationRaw   // Router link destination
  href?: string       // External link href
  disabled?: boolean  // Grayed out (current page)
}
```

## Slots

| Slot | Description |
|------|-------------|
| `custom-divider` | Custom divider element |

## Events

None.

## Usage

```vue
<!-- Basic breadcrumbs -->
<SBreadcrumbs :items="[
  { text: 'Home', to: '/' },
  { text: 'Products', to: '/products' },
  { text: 'Item', disabled: true },
]" />

<!-- Custom divider character -->
<SBreadcrumbs :items="breadcrumbs" divider="›" />

<!-- Custom divider slot -->
<SBreadcrumbs :items="breadcrumbs">
  <template #custom-divider>
    <SIcon icon="mdi-chevron-right" size="small" />
  </template>
</SBreadcrumbs>

<!-- Large size -->
<SBreadcrumbs :items="breadcrumbs" large />
```

```typescript
// Typical usage in a component
const breadcrumbs = computed(() => [
  { text: 'Home', to: { name: 'home' } },
  { text: 'Users', to: { name: 'users' } },
  { text: user.value.name, disabled: true },
])
```
