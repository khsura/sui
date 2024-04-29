export const htmlToText = (text: string) => {
  return text.replace(/<\/?[^>]+>/gi, '')
}

export const htmlToTexts = (text: string) => {
  return text.split(/<br\s?\/?>/gi).map((item) => htmlToText(item))
}
