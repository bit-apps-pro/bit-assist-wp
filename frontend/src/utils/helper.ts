export const getUserData = (cookie:string) =>
  JSON.parse(decodeURIComponent(escape(atob(atob(cookie || '')) || '{}')))