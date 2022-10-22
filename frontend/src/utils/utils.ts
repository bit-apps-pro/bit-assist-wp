export const textTrim = (text: string, length: number) => {
  if (text?.length > length) {
    return `${text.substring(0, length) }...`
  }
  return text || '-'
}

export const toSlug = (text: string, separator = '-') => text.toLowerCase().replace(/ /g, separator)
