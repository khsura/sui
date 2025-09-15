export type AutocompleteModelTypeBase = string | null | undefined | number

export type AutocompleteModelType<T extends boolean = boolean> = T extends true
  ? AutocompleteModelTypeBase[]
  : AutocompleteModelTypeBase

export type AutocompleteEmitEvents = {
  searchItem: [string]
}
