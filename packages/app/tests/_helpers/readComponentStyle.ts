import { readFileSync } from 'node:fs'
import path from 'node:path'

const styleBlockPattern = /<style[^>]*>([\s\S]*?)<\/style>/g

/**
 * The raw `<style>` source of a component, read from disk. jsdom/happy-dom do
 * not apply SFC styles, so tests that care about a CSS rule assert on its source.
 * @param componentPath path from `packages/app/components`, e.g. `form/sCheckbox.vue`
 */
export const readComponentStyle = (componentPath: string) => {
  const source = readFileSync(path.join(import.meta.dirname, '../../components', componentPath), 'utf8')

  return [...source.matchAll(styleBlockPattern)].map((match) => match[1]).join('\n')
}

/**
 * The body of the first `&__<element> {` block in a component's style source.
 */
export const readElementStyleRule = (componentPath: string, element: string) => {
  const style = readComponentStyle(componentPath)
  const rule = new RegExp(`&__${element} \\{([^}]*)\\}`).exec(style)

  return rule?.[1] ?? ''
}
