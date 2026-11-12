# SBreadcrumbs

**Import:** `import { SBreadcrumbs, type BreadcrumbsItem } from '@khsura/sui'`

Navigation trail showing the current page's location in a hierarchy. Renders a `<nav aria-label="breadcrumbs">` with an `<ol>`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsBreadcrumbs.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbsItem[]` | `undefined` | Breadcrumb entries |
| `divider` | `string` | `'/'` | Separator text between items |
| `large` | `boolean` | `false` | Larger text |
| `color` | `string \| null` | `undefined` | Text color of the enabled (link) items |

### BreadcrumbsItem

```ts
interface BreadcrumbsItem {
  text: string | number
  to?: RouteLocationRaw   // renders router-link
  href?: string           // renders <a>
  disabled?: boolean      // renders plain <span>
  link?: boolean          // declared on the type, not used by the component
}
```

Each item renders as `router-link` if `to` is set, else `<a>` if `href` is set, else `<span>`. A disabled item is always a `<span>`.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `custom-divider` | — | Replaces the divider text |

## Events

None.

## Usage

```vue
<SBreadcrumbs
  :items="[
    { text: 'Home', to: '/' },
    { text: 'Products', to: '/products' },
    { text: 'Item' },
  ]"
/>

<SBreadcrumbs :items="crumbs" divider="›" large color="primary" />

<SBreadcrumbs :items="crumbs">
  <template #custom-divider>
    <SIcon icon="mdi-chevron-right" size="small" />
  </template>
</SBreadcrumbs>
```

## Gotchas

- The **last item is disabled automatically** (current page) unless you set `disabled: false` on it explicitly.
- Disabled items ignore `color`.
- Pass `to` or `href` per item, not both — `to` wins.
- `to` requires vue-router in the app.
