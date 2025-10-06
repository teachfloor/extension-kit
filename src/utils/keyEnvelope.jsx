const PREFIX = 'ek:' // encoded key
const VERSION = 1

const toB64Url = (str) => {
  // encode UTF-8 to base64
  const base64 = btoa(unescape(encodeURIComponent(str)))
  // make URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromB64Url = (str) => {
  // restore to normal base64
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // decode base64 back to UTF-8
  return decodeURIComponent(escape(atob(base64)))
}

export const packKey = (key, params = {}) => {
  const payload = { v: VERSION, k: key, p: params }
  return PREFIX + toB64Url(JSON.stringify(payload))
}

export const unpackKey = (enveloped) => {
  if (!enveloped.startsWith(PREFIX)) {
    return { key: enveloped, params: {} }
  }

  const json = fromB64Url(enveloped.slice(PREFIX.length))
  const obj = JSON.parse(json)

  if (obj?.v !== VERSION || typeof obj.k !== 'string') {
    throw new Error('Invalid key envelope')
  }

  return { key: obj.k, params: obj.p ?? {} }
}
