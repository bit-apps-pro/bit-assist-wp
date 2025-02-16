export const textTrim = (text: string, length: number) => {
  if (text?.length > length) {
    return `${text.slice(0, Math.max(0, length))}...`
  }
  return text || '-'
}

export const toSlug = (text: string, separator = '-') => text.toLowerCase().replaceAll(' ', separator)
