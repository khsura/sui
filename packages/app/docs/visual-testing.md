# Visual regression testing

The visual harness screenshots every Storybook story tagged `visual` and compares each image with a committed baseline. It catches layout breaks that unit tests miss: a label that wraps, an input that is too wide on a phone, a menu that opens on the wrong side.

## What it captures

Every `visual` story is captured in 12 combinations:

| Axis    | Values                    |
| ------- | ------------------------- |
| Width   | 375, 768 and 1280 px      |
| Theme   | light and dark            |
| Browser | Chromium and WebKit       |

The harness builds a static Storybook (`storybook build`), serves it, and drives it with `@playwright/test`. Each Playwright project is one browser and theme pair, for example `webkit-dark`, and the baselines live in `tests/visual/__screenshots__/<project>/<story-id>--<width>.png`.

The theme comes from the Storybook `theme` global, which the app decorator passes to `useTheme().setTheme()`. You can switch it from the Storybook toolbar too.

To keep the screenshots stable, the harness:

- disables CSS animations and transitions, and hides the text caret
- emulates `prefers-reduced-motion: reduce`, the UTC time zone and the `en-US` locale
- freezes `Date` at a fixed instant and seeds faker, so generated story content is the same on every load
- runs the page offline: the Material Design Icons font comes from the local `@mdi/font` package, and other off-site requests (such as Google Fonts, which SUI styles do not use) are aborted
- waits until the story render and its `play` function finish, then waits for web fonts
- allows a small per-pixel colour difference (antialiasing) and fails when more than 0.2% of the pixels differ

The thresholds and the matrix live in `tests/visual/constants/visualMatrix.ts`.

## Run it

Screenshots differ between operating systems, because each one renders fonts differently. So the harness always runs inside the official `mcr.microsoft.com/playwright:v<version>-noble` image, the same one that CI uses. You need Docker.

```bash
# from packages/app
yarn test:visual
```

The script mounts the repository, installs the dependencies into a Docker volume (your own `node_modules` stays untouched), builds Storybook and runs the tests. Extra arguments go to Playwright:

```bash
yarn test:visual --project=chromium-light -g "Button"
```

When a test fails, open the HTML report in `.visual/report/index.html`. The expected, actual and diff images are in `.visual/results/`.

The same run also audits each `visual` story (and each `a11y` story) with axe, once per theme in Chromium; see [a11y.md](./a11y.md). Run only the audit with `yarn test:visual -g "a11y:"`.

Working from a second checkout, such as a git worktree? Give it its own `node_modules` volume, so two runs never install into the same one: `SUI_VISUAL_NODE_MODULES_VOLUME=sui-visual-node-modules-mybranch yarn test:visual`. Delete it afterwards with `docker volume rm sui-visual-node-modules-mybranch`.

## Tag a story as visual

Add `visual` to the story's `tags`. Write the story as a plain object literal: Storybook reads tags with a static parser, and it cannot see tags inside a call such as `createStoryObj({...})`.

```ts
import type { StoryObj } from '@storybook/vue3-vite'

export const Button = {
  tags: ['visual'],
  render: (args) => ({ components: { SButton }, setup: () => ({ args }), template: '<SButton v-bind="args" />' }),
  args: argsButton(),
} satisfies StoryObj<typeof SButton>
```

To tag every story in a file, put the tag on the default export (`meta`) instead, as `recipes.stories.ts` does.

To capture an open overlay, give the story a `play` function that opens it, like `DialogOpen` in `dialog.stories.ts`. The harness waits for `play` to finish before it takes the screenshot.

Keep the number of visual stories small. Each one adds 12 screenshots, and every screenshot slows the run down.

## Update the baselines

Update the baselines whenever a change to the UI is intended, and whenever you add a `visual` story.

**From CI (preferred).** Open the **Visual regression** workflow in GitHub Actions, choose **Run workflow**, pick your branch and tick **update**. The workflow regenerates the baselines that differ or are missing, commits them to the branch as `github-actions[bot]`, and uploads them as the `visual-baselines` artifact. A commit pushed by the workflow does not start other workflows, so re-run the pull request's **Visual regression** check afterwards, or push another commit.

**Locally.** This uses the same container, so the result matches CI:

```bash
yarn test:visual:update
```

Review the changed PNG files before you commit them. When you delete or rename a visual story, delete its old baselines by hand: the update writes new images but never removes old ones.

## In CI

`.github/workflows/visual.yaml` runs on every pull request to `main` and to `feature/**` branches. It fails when a screenshot differs from its baseline by more than the threshold, or when a baseline is missing, and it uploads the `visual-diff` artifact with the report and the expected, actual and diff images.

When you upgrade Playwright, change three places together: the exact `@playwright/test` and `playwright` versions in `packages/app/package.json`, and both `image:` tags in the workflow. Then regenerate all the baselines, because a new browser build renders slightly differently.
