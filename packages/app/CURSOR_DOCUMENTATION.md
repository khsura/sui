# SUI Framework - Cursor Documentation

This document provides comprehensive guidance for using the SUI framework in your applications with Cursor AI assistance.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Setup & Configuration](#setup--configuration)
4. [Basic Usage](#basic-usage)
5. [Components](#components)
6. [Services & Composables](#services--composables)
7. [Helpers & Utilities](#helpers--utilities)
8. [Types & Definitions](#types--definitions)
9. [Styling](#styling)
10. [Directives](#directives)
11. [Examples](#examples)

---

## Overview

SUI is a Vue 3 component framework built with TypeScript. It provides:

- **100+ Components**: Buttons, forms, layouts, navigation, data display, and more
- **Type Safety**: Full TypeScript support with type definitions
- **Vue 3 Composition API**: Modern Vue 3 patterns
- **Customizable Theming**: Built-in theme system
- **Services & Composables**: Reusable logic for common patterns

**Package Name**: `@khsura/sui`  
**Framework**: Vue 3  
**Language**: TypeScript

---

## Installation

### Prerequisites

- Node.js (v16+)
- Yarn package manager
- GitHub token (for private repository access)

### Install the Package

```bash
yarn add @khsura/sui
```

Or if using npm:

```bash
npm install @khsura/sui
```

---

## Setup & Configuration

### 1. Basic Vue App Setup

In your main application file (typically `main.ts` or `main.js`):

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { createSUI } from '@khsura/sui'

// Import base styles (required)
import '@khsura/sui/base.css'
// OR import SCSS if you want to customize
import '@khsura/sui/style.scss'

const app = createApp(App)

// Initialize SUI plugin
app.use(createSUI())

app.mount('#app')
```

### 2. Plugin Options

The `createSUI` function accepts optional configuration:

```typescript
import { createSUI } from '@khsura/sui'
import type { AppStateOptions } from '@khsura/sui/types'

const options: AppStateOptions = {
  // Your app-specific options
}

// Custom app name (default is 'sui')
app.use(createSUI(options, 'myApp'))
```

### 3. Accessing the Store

After installation, the SUI store is available globally:

```typescript
// In component script
export default {
  mounted() {
    // Access via global property
    const store = this.$sui
  },
}
```

Or using Composition API:

```typescript
import { inject } from 'vue'

export default {
  setup() {
    const store = inject('sui')
    return { store }
  },
}
```

---

## Basic Usage

### Importing Components

Components can be imported individually or from the main package:

```typescript
// Individual component imports
import { SButton, SCard, SInput } from '@khsura/sui'

// Or from components subpath
import { SButton, SCard, SInput } from '@khsura/sui/components'

// In your template
<template>
  <SContainer>
    <SCard>
      <SCardTitle>My Card</SCardTitle>
      <SCardText>Card content goes here</SCardText>
      <SButton color="primary">Click Me</SButton>
    </SCard>
  </SContainer>
</template>
```

### Component Naming Convention

All SUI components are prefixed with `S`:

- `SButton` - Button component
- `SCard` - Card component
- `SInput` - Input component
- `SDialog` - Dialog/Modal component
- etc.

---

## Components

### Available Component Categories

#### Layout Components

- `SApp` - Main app wrapper
- `SAppBar` - Application bar/header
- `SAppBarTitle` - App bar title
- `SContainer` - Container wrapper
- `SRow`, `SColumn` - Grid system
- `SSpacer` - Flexible spacer
- `SLayout` - Layout wrapper
- `SMain` - Main content area
- `SFooter` - Footer component
- `SNavigationDrawer` - Side navigation
- `SBottomNavigation` - Bottom navigation bar

#### Form Components

- `SInput` - Text input
- `STextarea` - Textarea input
- `SSelect` - Select dropdown
- `SAutocomplete` - Autocomplete input
- `SCheckbox` - Checkbox
- `SRadio` / `SRadioGroup` - Radio buttons
- `SSwitch` - Toggle switch
- `SForm` - Form wrapper
- `SFormInputError` - Form error display

#### Data Display

- `SCard` / `SCardTitle` / `SCardText` / `SCardActions` / `SCardSubtitle` - Card components
- `STable` / `STableBodyCell` / `STableHeadCell` / `STablePagination` - Table components
- `SList` / `SListItem` / `SListItemTitle` / `SListItemSubtitle` / `SListItemIcon` / `SListItemAction` / `SListItemContent` / `SListItemGroup` - List components
- `SBadge` / `SBadgeContent` - Badge component
- `SChip` - Chip/tag component
- `SImage` - Image component

#### Navigation

- `SBreadcrumbs` - Breadcrumb navigation
- `STabs` / `STab` - Tab navigation
- `SMenu` - Menu component
- `SToolbar` / `SToolbarTitle` / `SToolbarItem` - Toolbar

#### Feedback

- `SDialog` - Dialog/Modal
- `SSheet` - Bottom sheet
- `SSnackbar` - Snackbar notification
- `STooltip` - Tooltip
- `SOverlay` - Overlay component

#### Other Components

- `SButton` - Button
- `SIcon` - Icon component
- `SDivider` - Divider/separator
- `SSubheader` - Subheader
- `SProgressLinear` / `SProgressCircular` - Progress indicators
- `SCalendar` / `SCalendarMonthly` - Calendar
- `SDatePicker` / `SDatePickerDate` / `SDatePickerMonth` / `SDatePickerYear` / `SDatePickerSwitch` / `SDatePickerTitle` - Date picker
- `SCarousel` / `SCarouselItem` - Carousel
- `SExpansionPanel` / `SExpansionPanels` / `SExpansionPanelHeader` / `SExpansionPanelContent` - Expansion panels
- `SStepper` / `SStepperStep` - Stepper
- `SSlideGroup` / `SSlideItem` - Slide group
- `SToggleButtonGroup` / `SToggleButton` - Toggle button group
- `SSplitView` / `SSplitViewItem` - Split view
- `SDroppable` - Drag and drop
- `SWindow` / `SWindowItem` - Window component

### Component Usage Example

```vue
<template>
  <SContainer>
    <SRow>
      <SColumn :cols="12" :md="6">
        <SCard>
          <SCardTitle>Form Example</SCardTitle>
          <SCardText>
            <SForm>
              <SInput v-model="name" label="Name" placeholder="Enter your name" />
              <SSelect v-model="country" :items="countries" label="Country" />
              <SButton color="primary" @click="submit"> Submit </SButton>
            </SForm>
          </SCardText>
        </SCard>
      </SColumn>
    </SRow>
  </SContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SContainer, SRow, SColumn, SCard, SCardTitle, SCardText, SForm, SInput, SSelect, SButton } from '@khsura/sui'

const name = ref('')
const country = ref('')
const countries = [
  { title: 'USA', value: 'us' },
  { title: 'Canada', value: 'ca' },
  { title: 'UK', value: 'uk' },
]
</script>
```

---

## Services & Composables

SUI provides several composables and services for common functionality:

### Available Services

The main package exports these services with convenient aliases:

```typescript
// Import services (aliased for convenience)
import { useClickOutside, useDisplay, useScroll, useTheme } from '@khsura/sui'
```

Or import directly from services:

```typescript
import { useClickOutsideService, useDisplayService, useScrollService, useThemeService } from '@khsura/sui/services'
```

### useTheme

Theme management service:

```typescript
import { useTheme } from '@khsura/sui'

const { theme, setTheme, toggleTheme } = useTheme()
```

### useDisplay

Display breakpoint service:

```typescript
import { useDisplay } from '@khsura/sui'

const { isMobile, isTablet, isDesktop, breakpoint } = useDisplay()
```

### useScroll

Scroll service:

```typescript
import { useScroll } from '@khsura/sui'

const { scrollX, scrollY, scrollTo } = useScroll()
```

### useClickOutside

Click outside detection:

```typescript
import { useClickOutside } from '@khsura/sui'

const elementRef = ref<HTMLElement>()
useClickOutside(elementRef, () => {
  console.log('Clicked outside!')
})
```

### Internal Services

Many components use internal services that are also available:

```typescript
import {
  useDialogService,
  useMenuService,
  useFormInputService,
  useLayoutService,
  // ... and many more
} from '@khsura/sui/services'
```

---

## Helpers & Utilities

### Available Helpers

```typescript
import {
  createAppStore,
  // Theme helpers
  // Table helpers
  // Autocomplete helpers
  // Select item helpers
} from '@khsura/sui/helpers'
```

### Form Helpers

```typescript
import { getFormInputModelValueRules } from '@khsura/sui'

// Get validation rules for form inputs
const rules = getFormInputModelValueRules()
```

## Constants & Configs

### Constants

SUI exports various constants for colors, sizes, breakpoints, etc.:

```typescript
import {} from // Color constants
// Size constants
// Breakpoint constants
// Grid constants
// etc.
'@khsura/sui/constants'
```

### Configs

Configuration objects and utilities:

```typescript
import {} from // Color configs
// Size configs
// Grid configs
// Icon size configs
// Transition configs
// i18n configs
// etc.
'@khsura/sui/configs'
```

---

## Types & Definitions

### Importing Types

```typescript
import type {} from // Component prop types
// Event types
// Configuration types
// State types
'@khsura/sui/types'
```

### Common Types

```typescript
// App state options
import type { AppStateOptions } from '@khsura/sui/types'

// Component prop types are available for each component
// Check @types directory for full type definitions
```

### Component Props

All components have TypeScript definitions. Props are defined in the `definitions/props/` directory and can be imported:

```typescript
import type { ButtonProps } from '@khsura/sui/definitions/props/button'
```

---

## Styling

### Importing Styles

You have three options for importing styles:

#### Option 1: Base CSS (Recommended for quick start)

```typescript
import '@khsura/sui/base.css'
```

#### Option 2: Full CSS

```typescript
import '@khsura/sui/style.css'
```

#### Option 3: SCSS (Recommended for customization)

```typescript
import '@khsura/sui/style.scss'
// OR
import '@khsura/sui/styles/index.scss'
```

### Helper Styles

Import utility classes separately:

```typescript
import '@khsura/sui/helpers.scss'
```

### Customization

If using SCSS, you can override variables:

```scss
// In your main.scss or vite.config.ts
@import '@khsura/sui/styles/index.scss';

// Override variables
$primary-color: #your-color;
$secondary-color: #your-color;
```

### Utility Classes

SUI provides utility classes for common styling:

- Spacing: `s_ml__3`, `s_mr__2`, `s_pa__4`, etc.
- Text: `s_text--h5`, `s_text--body1`, etc.
- Colors: `s_color--primary`, `s_color--secondary`, etc.

---

## Directives

SUI provides Vue directives:

### v-scroll

Scroll directive for handling scroll events:

```vue
<template>
  <div v-scroll="handleScroll"> Scrollable content </div>
</template>
```

### v-resize

Resize directive for handling resize events:

```vue
<template>
  <div v-resize="handleResize"> Resizable content </div>
</template>
```

These directives are automatically registered when you use `createSUI()`.

---

## Examples

### Complete App Example

```vue
<template>
  <SApp>
    <SAppBar color="primary">
      <SAppBarTitle>My Application</SAppBarTitle>
    </SAppBar>

    <SLayout>
      <SNavigationDrawer v-model="drawer">
        <SList>
          <SListItem>
            <SListItemTitle>Home</SListItemTitle>
          </SListItem>
          <SListItem>
            <SListItemTitle>About</SListItemTitle>
          </SListItem>
        </SList>
      </SNavigationDrawer>

      <SMain>
        <SContainer>
          <SCard>
            <SCardTitle>Welcome</SCardTitle>
            <SCardText>
              <SInput v-model="input" label="Name" />
              <SButton color="primary" @click="handleClick"> Submit </SButton>
            </SCardText>
          </SCard>
        </SContainer>
      </SMain>
    </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SApp,
  SAppBar,
  SAppBarTitle,
  SLayout,
  SNavigationDrawer,
  SMain,
  SContainer,
  SCard,
  SCardTitle,
  SCardText,
  SList,
  SListItem,
  SListItemTitle,
  SInput,
  SButton,
} from '@khsura/sui'

const drawer = ref(false)
const input = ref('')

const handleClick = () => {
  console.log('Clicked!', input.value)
}
</script>
```

### Form with Validation Example

```vue
<template>
  <SForm @submit="handleSubmit">
    <SInput v-model="form.email" label="Email" type="email" :rules="emailRules" />
    <SInput v-model="form.password" label="Password" type="password" :rules="passwordRules" />
    <SSelect v-model="form.country" label="Country" :items="countries" />
    <SButton type="submit" color="primary"> Register </SButton>
  </SForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SForm, SInput, SSelect, SButton } from '@khsura/sui'

const form = ref({
  email: '',
  password: '',
  country: '',
})

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
]

const countries = [
  { title: 'United States', value: 'us' },
  { title: 'Canada', value: 'ca' },
  { title: 'United Kingdom', value: 'uk' },
]

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
}
</script>
```

### Dialog Example

```vue
<template>
  <div>
    <SButton @click="dialog = true">Open Dialog</SButton>

    <SDialog v-model="dialog" title="Confirm Action">
      <p>Are you sure you want to proceed?</p>
      <template #actions>
        <SButton @click="dialog = false">Cancel</SButton>
        <SButton color="primary" @click="confirm">Confirm</SButton>
      </template>
    </SDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SDialog } from '@khsura/sui'

const dialog = ref(false)

const confirm = () => {
  console.log('Confirmed!')
  dialog.value = false
}
</script>
```

---

## Package Exports

The package exports the following:

### Main Export

```typescript
import { SButton, createSUI, ... } from '@khsura/sui'
```

### Component Exports

```typescript
import { SButton, SCard } from '@khsura/sui/components'
```

### Service Exports

```typescript
import { useThemeService } from '@khsura/sui/services'
```

### Type Exports

```typescript
import type { AppStateOptions } from '@khsura/sui/types'
```

### Style Exports

```typescript
import '@khsura/sui/base.css'
import '@khsura/sui/style.css'
import '@khsura/sui/style.scss'
import '@khsura/sui/helpers.scss'
```

---

## Tips for Cursor AI

When working with SUI in Cursor:

1. **Import Paths**: Always use `@khsura/sui` as the import path
2. **Component Names**: All components start with `S` prefix
3. **TypeScript**: The framework is fully typed - leverage TypeScript for autocomplete
4. **Component Props**: Check component prop definitions in `definitions/props/` for available props
5. **Services**: Use composables for reusable logic (theme, display, scroll, etc.)
6. **Styling**: Import base.css or style.scss - utility classes are available
7. **Examples**: Refer to `packages/samples` for usage examples

---

## Troubleshooting

### Components not rendering

- Ensure you've imported the styles: `import '@khsura/sui/base.css'`
- Check that `app.use(createSUI())` is called before `app.mount()`

### TypeScript errors

- Ensure types are installed: `@types` directory should be present
- Check that you're using the correct import paths

### Styling issues

- Import the base CSS or SCSS file
- Check if utility classes are available after importing helpers.scss

---

## Additional Resources

- Check `packages/samples` for working examples
- Check `packages/storybook` for component documentation and props
- Component prop definitions are in `definitions/props/`
- Type definitions are in `types/` directory

---

## Version

Current version: Check `package.json` for the latest version.

---

_This documentation is designed to help Cursor AI understand and work with the SUI framework. For component-specific documentation, refer to Storybook or component prop definitions._
