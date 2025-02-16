export const select = (selector: string): HTMLElement | null => document.querySelector(selector)

export const checkValidEmail = (email: string) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

export function toBoolean(value: unknown): boolean {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    return lowerValue === 'true' || lowerValue === '1'
  }

  if (typeof value === 'number') {
    return value === 1
  }

  return !!value
}
