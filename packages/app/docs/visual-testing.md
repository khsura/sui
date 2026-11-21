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
- waits until the story render and its `play` function finish, then waits for web fonts. A `play` function that throws fails the test with its error, instead of capturing a half-finished story. A render that never finishes fails with the phase it got stuck in.
- turns off the a11y addon's automatic axe run (the `a11y.manual` global), because the separate audit below covers it
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

## Flaky captures

A capture that fails only sometimes is a bug, in a story, in a component or in the harness. Don't re-run it until it passes, and don't raise a timeout to hide it. Find what the capture raced against, then wait for that state.

Reproduce it with repeats, in the same container:

```bash
yarn test:visual -g "Stress / Drawer Variants @ 1280px" --repeat-each=10
```

Causes found so far:

- **Chromium closed the drawers in `Layout/Stress · Drawer Variants @ 1280px`.** A page taller than the viewport is captured with `captureBeyondViewport`, and that resizes the window for a moment, to 1×1 first. On that resize the `md` breakpoint flips, and SNavigationDrawer closes its persistent drawers when it goes mobile. By design, it does not reopen them when the width comes back. The capture then showed a stable layout with no drawers, in about one run in three. Growing the viewport to the page's height avoids the resize, but it changes every `100vh` layout, so the harness does not do it. Instead, the story now fits in one 800px viewport at desktop width. Keep any story whose state a resize can drop (a persistent drawer, for example) within one viewport height.
- **WebKit timed out waiting for the render, mostly in `Layout/Stress · Mobile Drawer Open`.** Storybook reports `finished` only after the a11y addon's automatic axe run (its `afterEach` phase). In WebKit that run took seconds per capture, and it first waited on a stylesheet preload that fails offline. When several Docker runs share the machine, it sometimes went past the 15s budget, in a different theme each time. The harness now turns that run off with the `a11y.manual` global, so the render finishes about a second after the page loads. The axe audit in `storyAccessibility.visual.ts` still covers every story. If you run the harness while other containers are busy, pass `--workers=2`.
- **A `play` function that threw still produced a screenshot.** In the static build, a throwing `play` ends the render in `finished`, not `errored`. So the run captured a half-played story and reported it as a screenshot difference. The harness now records Storybook's `playFunctionThrewException` (and related) events, and fails with the error message.
- **WebKit captured a scrolling row mid-scroll.** A `play` function that scrolls must wait for the scroll position itself, not for a component state that is set before the smooth scroll starts.
