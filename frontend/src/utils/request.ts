import config from '@config/config'

export const webhook = (url: string, data = {}) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

interface OptionsType {
  method: string
  headers: {
    [key: string]: string
  }
  body?: string
}

export default async function request(action: string, data: any = null, queryParam: any = null, method = 'POST') {
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
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'delete') {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(uri, options)
    .then(res => res.json())

  return response
}
