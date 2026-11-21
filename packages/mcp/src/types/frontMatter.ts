export interface FrontMatterDocument {
  /** Flat `key: value` pairs; nested YAML is not supported. */
  attributes: Record<string, string>
  body: string
}
