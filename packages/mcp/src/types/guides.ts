import type { GUIDE_TOPICS } from '../constants'

export type GuideTopic = (typeof GUIDE_TOPICS)[number]

/** One slice of a source markdown file; without `heading` the whole file is used. */
export interface GuideSourceSection {
  /** Repo-relative path (also the path under `dist/guides/`). */
  file: string
  /** Exact heading text, without the leading `#`s. */
  heading?: string
  /** `false` stops at the first sub-heading, keeping only the section's intro. Defaults to `true`. */
  includeSubsections?: boolean
}

export interface GuideDefinition {
  topic: GuideTopic
  title: string
  summary: string
  sections: readonly GuideSourceSection[]
}

export interface GuideSourceOptions {
  /** Root the `file` paths resolve against: `dist/guides` when bundled, else the monorepo root. */
  sourceRoot?: string
}

export type GuideLookup =
  { found: true; definition: GuideDefinition; markdown: string } | { found: false; topics: readonly GuideTopic[] }
