export const isServer = typeof window === 'undefined'
export const getEnv = (req = {}) => {
  let hostname = ''
  if (typeof window == 'object') {
    hostname = window.location.origin
  } else {
    hostname = req.headers && req.headers.host
  }

  let env = 'pro'
  if (!hostname) return env
  if (hostname.indexOf('test') > -1) {
    env = 'dev'
  } else if (hostname.indexOf('fat') > -1 || hostname.indexOf('fws') > -1) {
    env = 'fat'
  } else if (hostname.indexOf('uat') > -1) {
    env = 'uat'
  }
  return env
}
export function getAuthDomainKey(req = {}) {
  const env = getEnv(req)
  let authDomainKey = 'auth-Domain-pro'
  if (env !== 'pro') {
    authDomainKey = 'auth-Domain-test'
  }
  return authDomainKey
}
export function getSSOKey(req = {}) {
  const env = getEnv(req)
  let ssoKey = 'rsk-sso-token'
  if (env != 'pro') {
    ssoKey = 'rsk-sso-token-test'
  }
  return ssoKey
}
/**
 * 删除URL中指定search参数,会将参数值一起删除
 * @param {string} url 地址字符串
 * @param {array} aParam 要删除的参数key数组，如['name','age']
 * @return {string} 返回新URL字符串
 * //删除url中ticket参数
 */
export function ridUrlParam(url, aParam) {
  aParam.forEach((item) => {
    const fromindex = url.indexOf(`${item}=`) //必须加=号，避免参数值中包含item字符串
    if (fromindex !== -1) {
      // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
      const startIndex = url.indexOf('=', fromindex)
      const endIndex = url.indexOf('&', fromindex)
      const hashIndex = url.indexOf('#', fromindex)

      let reg
      if (endIndex !== -1) {
        // 后面还有search参数的情况
        const num = endIndex - startIndex
        reg = new RegExp(`${item}=.{${num}}`)
        url = url.replace(reg, '')
      } else if (hashIndex !== -1) {
        // 有hash参数的情况
        const num = hashIndex - startIndex - 1
        reg = new RegExp(`&?${item}=.{${num}}`)
        url = url.replace(reg, '')
      } else {
        // search参数在最后或只有一个参数的情况
        reg = new RegExp(`&?${item}=.+`)
        url = url.replace(reg, '')
      }
    }
  })
  const noSearchParam = url.indexOf('=')
  if (noSearchParam === -1) {
    url = url.replace(/\?/, '') // 如果已经没有参数，删除？号
  }
  return url
}
