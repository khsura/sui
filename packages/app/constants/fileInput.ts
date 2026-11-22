/** How SFileInput shows the files it holds. */
export enum FileInputDisplay {
  /** The file names, comma-separated and truncated with an ellipsis. */
  names = 'names',
  /** One chip per file. */
  chips = 'chips',
  /** The number of files, such as `3 files`; a single file still shows its name. */
  count = 'count',
}

/** The look of SFileInput. */
export enum FileInputVariant {
  /** A text-field box, like SInput. */
  input = 'input',
  /** A large dashed area that also takes files dragged onto it. */
  dropzone = 'dropzone',
}

/** Bytes in one kilobyte, megabyte step and so on: file sizes use binary units, as file managers do. */
export const fileSizeUnitStep = 1024
export const fileSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB']
/** Decimals shown for a size of 1 KB or more: `1.5 MB`. */
export const fileSizeFractionDigits = 1
/** Separates the entries of an `accept` string: `.csv,.xlsx,image/*`. */
export const fileAcceptSeparator = ','
/** The suffix of an `accept` entry that matches a whole MIME family: `image/*`. */
export const fileAcceptWildcardSuffix = '/*'
/** Starts an `accept` entry that is a file extension: `.csv`. */
export const fileAcceptExtensionPrefix = '.'
/** Separates the selected file names in the `names` display. */
export const fileInputNameSeparator = ', '
/** The loading spinner's diameter in pixels, the size SAutocomplete's spinner uses. */
export const fileInputLoaderSize = 20
