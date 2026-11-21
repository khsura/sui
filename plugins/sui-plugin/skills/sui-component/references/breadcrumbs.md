# SBreadcrumbs

**Import:** `import { SBreadcrumbs, type BreadcrumbsItem } from '@khsura/sui'`

Navigation trail showing the current page's location in a hierarchy. Renders a `<nav aria-label="breadcrumbs">` with an `<ol>`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsBreadcrumbs.d.ts`

<!-- generated:api:start SBreadcrumbs -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SBreadcrumbs props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string \| null` | — | no | — |
| `divider` | `string` | `"/"` | no | — |
| `items` | `BreadcrumbsItem[]` | — | no | — |
| `large` | `boolean` | — | no | — |

**SBreadcrumbs slots**

| Slot | Slot props |
| --- | --- |
| `custom-divider` | `{}` |

**SBreadcrumbs events**

None.

<!-- generated:api:end SBreadcrumbs -->

**SBreadcrumbs notes**

- `items`: Breadcrumb entries
- `divider`: Separator text between items
- `large`: Larger text
- `color`: Text color of the enabled (link) items
- `custom-divider` (slot): Replaces the divider text

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
