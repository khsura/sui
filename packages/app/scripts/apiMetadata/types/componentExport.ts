export type ComponentExport = {
  /** Public export name, e.g. `SButton`. */
  name: string
  /** `.vue` path relative to the app root, always with `/` separators. */
  file: string
  /** Top-level folder under `components/`, or `core` for files directly in it. */
  family: string
}
