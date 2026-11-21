export type SkillTableSync = {
  /** The markdown with every known generated block rewritten. */
  content: string
  /** Components whose generated block was rendered, in file order. */
  components: string[]
  /** Marker names that are not a component in sui-api.json; their blocks are left as they were. */
  unknownComponents: string[]
  /** Markers without a matching partner, e.g. a start with no end or an end naming another component. */
  malformedMarkers: string[]
}
