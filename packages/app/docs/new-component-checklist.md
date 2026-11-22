# New component checklist

This is the definition of done for a new SUI component, such as `SAvatar` or `SPagination`. A component that ships with half its docs is the one that AI assistants misuse, so a pull request that adds a component must tick every box below.

Paths are relative to `packages/app` unless they start with `plugins/` or `packages/mcp/`.

## 1. Scaffold it

```bash
# from packages/app
yarn scaffold:component Avatar            # or SAvatar; multi-word names are PascalCase: SkeletonLoader
yarn scaffold:component Avatar --dry-run  # list what would be written, write nothing
```

The script refuses to overwrite existing files. It writes:

| File | What it holds |
| --- | --- |
| `definitions/props/propsAvatar.ts` | `PropsAvatar`: an example `text` prop plus `PropsColor` (`color`, `colorThreshold`, `theme`) and `PropsSizePreset` (`size`) |
| `components/sAvatar.vue` | `<script setup>` with `defineProps<PropsAvatar>()`, `useComponentDefaultsService('SAvatar', …)`, `useColorService`, `useSizeService`, `defineSlots`, and a `<style lang="scss">` block for `.s_avatar` with `@include s_dark()` |
| `storybook/stories/avatar.stories.ts` | `UI Components/Avatar`: an args playground story, and `AvatarStress`, a story tagged `visual` with a `play` check |
| `tests/components/sAvatar.test.ts` | Unit tests that mount it inside `SApp` with `mountWithApp` |
| `docs/components/avatar.md` | The hand-written reference, with a link to the Storybook page on https://sui.surakh.com/ |
| `plugins/sui-plugin/skills/sui-component/references/avatar.md` | The skill reference, with an empty `generated:api` marker pair for the API tables |

It also registers the component in:

- `definitions/props/index.ts`: `export * from './propsAvatar'`
- `components/index.ts`: `export { default as SAvatar } from './sAvatar.vue'`. This line is what makes it public: `sui-api.json` (and so the MCP and the skill tables) lists every `S*` component reachable from this barrel.
- `plugins/sui-plugin/skills/sui-component/SKILL.md`: a row in the reference index
- `docs/summary.md`: a row in the first table. Move it to the right section.

When it prints `! … mentions SAvatar as missing or as an alias`, remove that entry (see step 7).

The generated files pass lint, `vue-tsc` and the tests as they are. Next, replace every `TODO(scaffold)` and the example `text` prop, then work through the rest of this list.

A component that belongs to a family (several parts, such as `SPagination` with an item part) goes in its own folder, `components/pagination/`, with an `index.ts` barrel of `export { default as … }` lines and an `export * from './pagination'` line in `components/index.ts`. Add the folder name to `FAMILY_PURPOSES` in `packages/mcp/src/constants/componentCatalog.ts`.

## 2. Props

- [ ] Props live in `definitions/props/propsX.ts`, never inline in the `.vue` file. Reuse the core props (`definitions/props/core`: `PropsColor`, `PropsDisabled`, `PropsBorder`, `PropsElevation`, `PropsTag`, `PropsLink`, …) instead of redefining them. Keep the names other SUI components use: `color`, `size`, `disabled`, `outlined`, `to` / `href`.
- [ ] Every own prop has a JSDoc comment. It becomes the prop's description in `sui-api.json`, so the MCP's `get_component_api` and the skill tables show it.
- [ ] Enum-like props are string-literal unions (types go in `types/`, the value lists in `configs/` or `constants/`), so `sui-api.json` lists their values and the validator's `invalid-enum-value` rule can check them.
- [ ] Optional props are written `name?: T | undefined`. No `any`.
- [ ] Density-ready. Size things with `size` (`PropsSizePreset`) and SCSS `!default` variables, never with hard-coded heights or paddings in the rules. A global `density` (M4) will then only need to change the variables.
- [ ] The component reads its props through `useComponentDefaultsService('SX', rawProps)`, so `createSUI({ defaults: { SX: { … } } })` defaults work (see [component-defaults.md](./component-defaults.md)). Add `SX: PropsX` to `ComponentPropsMap` (`definitions/componentDefaults.ts`), and if it has a preset-scale `size`, `borderRadius`, `rounded`, `elevation` or accent `color`, add it to `globalComponentDefaultTargets` (`configs/componentDefaults.ts`) so `defaults.global` reaches it.

## 3. Component

- [ ] `components/sX.vue` (camelCase file name with the `s` prefix), `<script setup lang="ts">`, arrow functions, no magic numbers (named constants in `constants/`, or SCSS variables).
- [ ] `defineSlots` lists every slot with its slot props, and `defineEmits` every event with its payload. A component that renders a `<slot>` without `defineSlots` fails the `buildApiMetadata` test.
- [ ] Use `v-model` (`defineModel` or a `modelValue` prop with an `update:modelValue` event) for the value a user changes.
- [ ] Root CSS class `s_x`, BEM elements `s_x__part`, modifiers `s_x--state`.
- [ ] Styles live in the component's `<style lang="scss">` block, or in `styles/components/x/` when they are large or shared, and use the theme helpers: `s_getAppColor('text')`, `s_getThemeColor(...)`, `$s_spacer`. No hard-coded colours.

## 4. Accessibility and keyboard

Follow [a11y.md](./a11y.md) (WCAG 2.2 AA).

- [ ] The right element and role. Use a native element first (`<button>`, `<nav>`, `<hr>`). Otherwise set `role` and the `aria-*` state attributes (`aria-current`, `aria-pressed`, `aria-expanded`, `aria-selected`, `aria-valuenow`).
- [ ] An accessible name. Icon-only controls take an `aria-label` or have an English default that can be overridden (`prevAriaLabel`, `nextAriaLabel`, …).
- [ ] Keyboard: each interactive part is reachable with Tab (or a roving `tabindex` for a composite widget, such as tabs), Enter and Space activate it, and the arrow keys, Home, End and Esc work where the WAI-ARIA pattern expects them. Add a row for the component to the keyboard table in `a11y.md`.
- [ ] A visible `:focus-visible` ring using the `focusRing` app colour.
- [ ] Decorative-only components (a skeleton loader, say) are hidden from screen readers (`aria-hidden="true"`) or announce one status (`role="status"`, `aria-busy`).
- [ ] The story meta carries `tags: ['a11y']` when the component is interactive, so CI's axe audit covers it even beyond the `visual` story.

## 5. Dark mode and theme

- [ ] Colours come from the theme (`s_getAppColor`, `useColorService`), so the dark theme works without extra rules. `@include s_dark()` makes the per-component `theme` prop work.
- [ ] Text on a `color` background reaches 4.5:1 contrast. `useColorService` picks the text colour, so do not hard-code white.
- [ ] Check the stories in both themes (the Storybook toolbar `theme` global). The `visual` stress story is captured in light and dark in CI.

## 6. Stories and visual tests

Read [visual-testing.md](./visual-testing.md).

- [ ] `storybook/stories/x.stories.ts`, title `UI Components/X`, `component: SX`.
- [ ] `args` cover every prop, and `argTypes` give every enum prop a select control (reuse `storybook/argTypes`, such as `argTypesColor` and `argTypesSizePreset`, and add a file there for the component's own enums).
- [ ] One `XStress` story tagged `visual`, written as a plain object literal (`satisfies StoryObj<…>`), that groups the cases AI code gets wrong: long text, empty content, every size, colours, inside a flex row or column, at 375 px. Its `play` asserts the geometry (no horizontal page overflow, nothing clipped) and opens any overlay. A throwing `play` fails CI.
- [ ] Run the story's play check locally: `yarn g:vitest run --project storybook storybook/stories/x.stories.ts`.
- [ ] Do not run Docker locally for this. Push and let CI's `visual` job report the missing baselines, then create them with `gh workflow run visual.yaml --ref <branch> -f update=true` and re-run the check.

## 7. Unit tests

- [ ] `tests/components/sX.test.ts`: every prop, slot and event; keyboard handling (`trigger('keydown', { key: 'ArrowRight' })`); ARIA attributes; `v-model` updates. Mount with `mountWithApp` from `tests/_helpers`.
- [ ] `yarn test` passes.

## 8. Documentation

- [ ] `docs/components/x.md` (kebab-case file name), in the layout of `chip.md`: import, what it renders, props / slots / events tables, usage, accessibility, notes. Link the Storybook page on https://sui.surakh.com/. Its link has the form `https://sui.surakh.com/?path=/docs/ui-components-x--docs`.
- [ ] Add the component to the right section of `docs/components/index.md` and `docs/summary.md`.
- [ ] Remove the component from "Components that do NOT exist" in `plugins/sui-plugin/skills/sui-component/SKILL.md`, and from `COMPONENT_ALIASES` in `packages/mcp/src/constants/componentAliases.ts` (with its hint, such as `AVATAR_HINT`), when either lists it. The MCP never uses an alias for a real component, but the stale hint is misleading.

## 9. Plugin skill reference

- [ ] `plugins/sui-plugin/skills/sui-component/references/x.md` holds the import, a usage example, the gotchas (a ❌ / ✅ table of likely misuses) and the docs link. Leave the tables between `<!-- generated:api:start SX -->` and `<!-- generated:api:end SX -->` to the generator.
- [ ] Fill the generated tables: `yarn build:api && yarn sync:skills` in `packages/app`, then commit the reference. CI fails when they are stale (`check:skills` in `test-build.yaml`).
- [ ] The component is in the `SKILL.md` reference index, and its `description` front matter names it when it is a common one.
- [ ] Bump the minor version in `plugins/sui-plugin/.claude-plugin/plugin.json`. Check the version on your branch first, because other tasks bump it too.

## 10. MCP visibility (`sui-api.json`)

- [ ] `yarn build:api` prints one more component, and `dist/sui-api.json` has an entry for `SX` with every prop (and its description and enum values), slot and event. The MCP serves `list_components` and `get_component_api` from this file, so nothing else needs registering.
- [ ] `validate_sui_template` accepts a correct template that uses `SX` (no `unknown-component` or `unknown-prop`) and rejects a misspelt prop.

## 11. Validator rules for likely AI misuse

The validator has no per-component registry. Rules are `{ id, check }` objects (`TemplateRule` in `packages/mcp/src/types/templateValidator.ts`) grouped in `packages/mcp/src/services/behaviourRules.ts` (styling and behaviour misuses) and `compositionRules.ts` (how components fit together). Unknown props, slots, enum values and components are already caught from `sui-api.json`.

- [ ] List the misuses an AI is likely to make: a prop name from Vuetify or Quasar that SUI spells differently, a required parent or child, a slot pattern, a prop pair that conflicts. Add the important ones to the skill reference's gotchas table.
- [ ] For each misuse the API alone cannot catch, add a rule: a `RULE_X` id in `packages/mcp/src/constants/templateValidator.ts`, the rule object in the right services file, the rule in that file's exported array, and a `fixHint` that shows the correct code (with a `recipe` when one shows the pattern). Set `fixedIn` only for a rule about a bug that a later release fixes.
- [ ] Test it in `packages/mcp/tests/services/` with a failing and a passing template. The tests run against `tests/fixtures/suiApiLatest.json`, so add the component's entry from `dist/sui-api.json` to that fixture.
- [ ] `yarn lint`, `yarn typecheck` and `yarn test` pass in `packages/mcp`.

## 12. Verify

Run these in `packages/app` (and in `packages/mcp` when you changed it) and report the real results in the pull request:

- [ ] `yarn lint` and `yarn stylelint`
- [ ] `yarn g:vue-tsc --noEmit`
- [ ] `yarn test`
- [ ] `yarn g:vitest run --project storybook storybook/stories/x.stories.ts`
- [ ] `yarn build:api && yarn sync:skills`, with the updated skill reference committed
