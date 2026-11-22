/** Every spelling of one new component's name that the generated files use. */
export type ComponentNames = {
  /** PascalCase name without the prefix: `SkeletonLoader`. */
  base: string
  /** Public export name: `SSkeletonLoader`. */
  component: string
  /** camelCase name: `skeletonLoader` (story file, BEM block, `useSizeService` block). */
  camel: string
  /** kebab-case name: `skeleton-loader` (docs and skill reference file names). */
  kebab: string
  /** Props type: `PropsSkeletonLoader`. */
  propsType: string
  /** Props file name without extension: `propsSkeletonLoader`. */
  propsFile: string
  /** Component file name without extension: `sSkeletonLoader` (the .vue file and its test). */
  componentFile: string
  /** Vue file name: `sSkeletonLoader.vue`. */
  vueFile: string
  /** Root CSS class: `s_skeletonLoader`. */
  cssBlock: string
}

/** One file the scaffold writes, with its path relative to packages/app. */
export type ScaffoldFile = {
  path: string
  content: string
}

/** An existing file the scaffold edits to register the component. */
export type ScaffoldRegistration = {
  path: string
  update: (source: string) => string
}
