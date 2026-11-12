# SBreadcrumbs

**Import:** `import { SBreadcrumbs, type BreadcrumbsItem } from '@khsura/sui'`

Navigation trail showing the current page's location in a hierarchy.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbsItem[]` | `undefined` | Array of breadcrumb entries |
| `divider` | `string` | `'/'` | Separator text between items |
| `large` | `boolean` | `false` | Larger text size |
| `color` | `string \| null` | `undefined` | Text color of the enabled (link) items |

### BreadcrumbsItem shape

```typescript
interface BreadcrumbsItem {
  text: string | number    // Display label
  to?: RouteLocationRaw    // Renders a router-link
  href?: string            // Renders an <a>
  disabled?: boolean       // Renders a plain <span>, grayed out
  link?: boolean           // Declared on the type, not used by the component
}
```

Each item renders as `router-link` if `to` is set, else `<a>` if `href` is set, else `<span>`. A disabled item is always a `<span>`.

## Slots

| Slot | Description |
|------|-------------|
| `custom-divider` | Replaces the divider text |

## Events

None.

## Usage

```vue
<!-- Basic breadcrumbs -->
<SBreadcrumbs :items="[
  { text: 'Home', to: '/' },
  { text: 'Products', to: '/products' },
  { text: 'Item' },
]" />

<!-- Custom divider character -->
<SBreadcrumbs :items="breadcrumbs" divider="›" />

<!-- Custom divider slot -->
<SBreadcrumbs :items="breadcrumbs">
  <template #custom-divider>
    <SIcon icon="mdi-chevron-right" size="small" />
  </template>
</SBreadcrumbs>

<!-- Large size, colored links -->
<SBreadcrumbs :items="breadcrumbs" large color="primary" />
```

```typescript
// Typical usage in a component
const breadcrumbs = computed(() => [
  { text: 'Home', to: { name: 'home' } },
  { text: 'Users', to: { name: 'users' } },
  { text: user.value.name, disabled: true },
])
```

## Notes

- The **last item is disabled automatically** (current page) unless you set `disabled: false` on it explicitly.
- Disabled items ignore `color`.
- `to` wins over `href` when both are set; `to` requires vue-router in the app.
