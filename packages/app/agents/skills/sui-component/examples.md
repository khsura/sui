# SUI component examples

Code snippets and patterns for `@khsura/sui` components. Use with [SKILL.md](./SKILL.md) for when to use each component and key props.

## Docs and reference

- **This skill**: [SKILL.md](./SKILL.md) — overview, component index, activator pattern.
- **Skills**: [Extend Claude with skills](https://code.claude.com/docs/en/skills).

---

## Activator slot

**SDialog, SMenu, STooltip, SSnackbar** — always bind both `v-on` and `v-bind` from `#activator`:

```vue
<SDialog v-model="open">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" color="primary">Open</SButton>
  </template>
  <SCard :max-width="480">
    <SCardTitle>Title</SCardTitle>
    <SCardText>Content</SCardText>
    <SCardActions>
      <SSpacer />
      <SButton @click="open = false">Cancel</SButton>
      <SButton color="primary" @click="confirm">OK</SButton>
    </SCardActions>
  </SCard>
</SDialog>
```

---

## SButton

```vue
<SButton color="primary" :loading="loading" @click="action">Label</SButton>
<SButton variant="icon"><SIcon icon="mdi-plus" /></SButton>
<SButton variant="fab" color="primary"><SIcon icon="mdi-pencil" /></SButton>
<SButton variant="text" color="primary">Text only</SButton>
<SButton outlined rounded color="secondary">Outlined</SButton>
<SButton block color="primary">Full width</SButton>
<SButton :to="{ name: 'home' }">Router link</SButton>
```

Key props: `color`, `variant` (`fab|text|icon`), `size`, `loading`, `block`, `rounded`, `outlined`, `disabled`, `href`, `to`

---

## SCard

```vue
<SCard :max-width="480" elevation="2">
  <SCardTitle>Title</SCardTitle>
  <SCardSubtitle>Subtitle</SCardSubtitle>
  <SCardText>Body content</SCardText>
  <SCardActions>
    <SSpacer />
    <SButton @click="cancel">Cancel</SButton>
    <SButton color="primary" @click="ok">OK</SButton>
  </SCardActions>
</SCard>
```

---

## SDialog

```vue
<!-- With activator (self-contained) -->
<SDialog v-model="open" :max-width="480">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" color="primary">Open</SButton>
  </template>
  <SCard>...</SCard>
</SDialog>

<!-- Programmatic -->
<SButton @click="dialog = true">Open</SButton>
<SDialog v-model="dialog"><SCard>...</SCard></SDialog>

<!-- Bottom sheet -->
<SDialog v-model="sheet" location="bottom">
  <SCard><SCardText>Sheet content</SCardText></SCard>
</SDialog>

<!-- Fullscreen -->
<SDialog v-model="fullscreen" fullscreen><SCard>...</SCard></SDialog>

<!-- Persistent (can't close by clicking outside) -->
<SDialog v-model="open" persistent><SCard>...</SCard></SDialog>
```

---

## SMenu

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" variant="icon">
      <SIcon icon="mdi-dots-vertical" />
    </SButton>
  </template>
  <SList>
    <SListItem @click="edit"><SListItemTitle>Edit</SListItemTitle></SListItem>
    <SListItem @click="remove"><SListItemTitle>Delete</SListItemTitle></SListItem>
  </SList>
</SMenu>
```

---

## STooltip

```vue
<STooltip text="Helpful tip">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" variant="icon">
      <SIcon icon="mdi-information" />
    </SButton>
  </template>
</STooltip>
```

---

## SSnackbar

```vue
<SSnackbar v-model="show" :timeout="4000" color="success">
  Saved successfully!
</SSnackbar>

<!-- With action -->
<SSnackbar v-model="show" :timeout="-1">
  Something happened.
  <template #action>
    <SButton variant="text" color="primary" @click="show = false">Dismiss</SButton>
  </template>
</SSnackbar>
```

---

## SList

```vue
<SList>
  <SListItem v-for="item in items" :key="item.id" :to="item.route" link>
    <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
    <SListItemContent>
      <SListItemTitle>{{ item.title }}</SListItemTitle>
      <SListItemSubtitle>{{ item.subtitle }}</SListItemSubtitle>
    </SListItemContent>
    <SListItemAction>
      <SIcon icon="mdi-chevron-right" />
    </SListItemAction>
  </SListItem>
</SList>
```

---

## STabs + SWindow

```vue
<STabs v-model="tab">
  <STab value="one">First</STab>
  <STab value="two">Second</STab>
</STabs>

<SWindow v-model="tab">
  <SWindowItem value="one">Content one</SWindowItem>
  <SWindowItem value="two">Content two</SWindowItem>
</SWindow>
```

---

## SExpansionPanels

`v-model` = `number[]` (indexes of open panels).

```vue
<SExpansionPanels v-model="openPanels">
  <SExpansionPanel v-for="(panel, i) in panels" :key="i">
    <SExpansionPanelHeader>{{ panel.title }}</SExpansionPanelHeader>
    <SExpansionPanelContent>{{ panel.content }}</SExpansionPanelContent>
  </SExpansionPanel>
</SExpansionPanels>
```

---

## SChip / SBadge

```vue
<SChip color="primary">Label</SChip>
<SChip outlined closable @click:close="remove(item)">Removable</SChip>

<SBadge content="5" color="error">
  <SIcon icon="mdi-bell" />
</SBadge>
```

---

## SProgressLinear / SProgressCircular

```vue
<SProgressLinear :model-value="75" color="primary" />
<SProgressLinear indeterminate color="primary" />

<SProgressCircular :model-value="75" :size="64" color="primary" />
<SProgressCircular indeterminate color="primary" />
```

---

## SDatePicker

```vue
<SDatePicker v-model="date" type="date" />
<!-- v-model is a string: 'YYYY-MM-DD' for date, 'YYYY-MM' for month -->

<SDatePicker v-model="month" type="month" />
```

---

## SBreadcrumbs

```vue
<SBreadcrumbs
  :items="[
    { text: 'Home', to: '/' },
    { text: 'Products', to: '/products' },
    { text: 'Detail', disabled: true },
  ]"
/>
```

---

## SStepper

```vue
<SStepper v-model="step">
  <SStepperStep :step="1" :complete="step > 1">Account</SStepperStep>
  <SStepperStep :step="2" :complete="step > 2">Profile</SStepperStep>
  <SStepperStep :step="3">Confirm</SStepperStep>
</SStepper>
```

---

## SToggleButtonGroup

```vue
<SToggleButtonGroup v-model="selected" multiple>
  <SToggleButton value="bold"><SIcon icon="mdi-format-bold" /></SToggleButton>
  <SToggleButton value="italic"><SIcon icon="mdi-format-italic" /></SToggleButton>
  <SToggleButton value="underline"><SIcon icon="mdi-format-underline" /></SToggleButton>
</SToggleButtonGroup>
```
