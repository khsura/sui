const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Text made safe for `v-html`: the characters HTML treats as markup become entities. */
export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (character) => htmlEntities[character] ?? character)
