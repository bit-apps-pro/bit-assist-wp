/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@config/config'

export const webhook = (url: string, data = {}) => {
  fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

interface OptionsType {
  body?: string
  headers: Record<string, string>
  method: string
}

export default async function request(action: string, data?: any, queryParam?: any, method = 'POST') {
  const { AJAX_URL, NONCE, ROUTE_PREFIX } = config
  const uri = new URL(AJAX_URL)
  uri.searchParams.append('action', `${ROUTE_PREFIX}${action}`)
  uri.searchParams.append('_ajax_nonce', NONCE)

  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const options: OptionsType = {
    headers: {
      'Content-Type': 'application/json'
    },
    method
  }
  if (
    method.toLowerCase() === 'post' ||
    method.toLowerCase() === 'put' ||
    method.toLowerCase() === 'delete'
  ) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(uri, options).then(res => res.json())

  return response
}
