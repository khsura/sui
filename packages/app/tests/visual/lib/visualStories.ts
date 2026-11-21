import { readFileSync } from 'node:fs'
import path from 'node:path'
import { storybookA11yManualGlobal, visualTag } from '../constants'
import { storyIndexSchema } from '../schemas'
import type { StoryIndexEntry, VisualTheme } from '../types'

// Reads the static build's index.json synchronously: Playwright collects tests at import time.
// Returns the stories carrying at least one of `tags`.
export const readTaggedStories = (storybookDir: string, tags: string[]): StoryIndexEntry[] => {
  const indexPath = path.join(storybookDir, 'index.json')
  const storyIndex = storyIndexSchema.parse(JSON.parse(readFileSync(indexPath, 'utf8')))

  return Object.values(storyIndex.entries)
    .filter((entry) => entry.type === 'story' && entry.tags.some((tag) => tags.includes(tag)))
    .sort((left, right) => left.id.localeCompare(right.id))
}

export const readVisualStories = (storybookDir: string) => readTaggedStories(storybookDir, [visualTag])

export const getVisualStoryPath = (storyId: string, theme: VisualTheme) => {
  const query = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
    globals: `theme:${theme};${storybookA11yManualGlobal}`,
  })

  return `/iframe.html?${query.toString()}`
}
