import { readFileSync } from 'node:fs'
import path from 'node:path'
import { visualTag } from '../constants'
import { storyIndexSchema } from '../schemas'
import type { StoryIndexEntry, VisualTheme } from '../types'

// Reads the static build's index.json synchronously: Playwright collects tests at import time.
export const readVisualStories = (storybookDir: string): StoryIndexEntry[] => {
  const indexPath = path.join(storybookDir, 'index.json')
  const storyIndex = storyIndexSchema.parse(JSON.parse(readFileSync(indexPath, 'utf8')))

  return Object.values(storyIndex.entries)
    .filter((entry) => entry.type === 'story' && entry.tags.includes(visualTag))
    .sort((left, right) => left.id.localeCompare(right.id))
}

export const getVisualStoryPath = (storyId: string, theme: VisualTheme) => {
  const query = new URLSearchParams({ id: storyId, viewMode: 'story', globals: `theme:${theme}` })

  return `/iframe.html?${query.toString()}`
}
