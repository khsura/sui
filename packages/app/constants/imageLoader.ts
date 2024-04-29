export enum FileMimeType {
  apng = 'image/apng',
  bmp = 'image/bmp',
  gif = 'image/gif',
  jpeg = 'image/jpeg',
  pjpeg = 'image/pjpeg',
  png = 'image/png',
  svg = 'image/svg+xml',
  tiff = 'image/tiff',
  webp = 'image/webp',
  xIcon = 'image/x-icon',
}

export const mimeTypeToFileType: Record<string, string | undefined> = {
  [FileMimeType.jpeg]: 'jpg',
}
