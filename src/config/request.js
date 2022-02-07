import cModel from '@ctrip/nfes-offline-model/cModel/index'
import { getCookie } from '@ctrip/nfes/util'
import { getFetchUrl, getNSEFetchUrl } from '@/config/serviceUrl'
import { getEnv, getSSOKey, getAuthDomainKey, isServer } from '@/util'
import { notification, message } from 'antd'
import httpCode from './httpCode'
let cModelIns = new cModel({
  timeout: 5000,
  method: 'POST',
  ignoreCID: true,
})

let nseCModel = new cModel({
  timeout: 5000,
  method: 'POST',
  ignoreCID: true,
})
/**
 *
 * @param {String} url 请求地址
 * @param {String} method 请求方法
 * @param {Object} param 请求参数
 * @param {Boolean} showMsg 请求错误是否提示错误信息
 * @param {String} ctx 是否是服务端请求
 * @returns
 */
export const request = async (
  params = {},
  ctx = {
    req: {},
  }
) => {
  try {
    const {
      url,
      method = 'POST',
      timeout = 20000,
      param,
      responseType = 'json',
      showMsg = false,
    } = params
    const { req } = ctx
    let token = ''
    const ssokey = getSSOKey(req)
    let env = getEnv(req)
    if (isServer) {
      token = req.cookies[ssokey] || req.token
    } else {
      token = getCookie(ssokey)
    }
    const serviceUrl = getFetchUrl(env, url)
    if (!token) {
      return Promise.resolve({
        code: 'error',
      })
    }
    return new Promise((resolve, reject) => {
      cModelIns
        .fetch(serviceUrl, {
          method: method,
          timeout: timeout,
          body: {
            ...param,
          },
          headers: {
            'rsk-sso-token': token,
          },
          responseType: responseType,
          isNoHead: true,
          // response: true,
        })
        .then(
          (res) => {
            const { code, message: msg } = res
            let codes = ['0', 'success']
            if (!codes.includes(code) && showMsg) {
              message.error({
                content: msg,
                duration: 5,
              })
            }
            resolve(res)
          }
          // (error) => {
          //   debugger
          //   reject(error)
          // }
        )
        .catch((err) => {
          console.log('err.response.status')
          const status = err?.response?.status || 0
          notification.error({
            description: err.message,
            message: httpCode[status],
          })
        })
    })
  } catch (err) {
    console.log('request-111', err)
  }
}

export const requestNSE = async (params = {}, ctx = {}) => {
  try {
    const {
      url,
      method = 'POST',
      timeout = 20000,
      param,
      responseType = 'json',
      showMsg = false,
    } = params
    let token = '',
      workDomain = ''
    const { req = {} } = ctx
    let env = getEnv(req)
    const ssokey = getSSOKey(req)
    const authDomainKey = getAuthDomainKey(req) //取风险域的key名
    if (isServer) {
      token = req.cookies[ssokey] || req.token
      workDomain =(req.cookies[authDomainKey] && JSON.parse(decodeURIComponent(req.cookies[authDomainKey])).code) || req.workDomain.code
    } else {
      token = getCookie(ssokey)
      workDomain = JSON.parse(decodeURIComponent(getCookie(authDomainKey))).code
    }
    const serviceUrl = getNSEFetchUrl(env, url)
    if (!token) {
      return Promise.resolve({
        code: 'error',
      })
    }
    return new Promise((resolve, reject) => {
      nseCModel
        .fetch(serviceUrl, {
          method: method,
          timeout: timeout,
          body: param,
          headers: {
            'rsk-sso-token': token,
            'user-work-domain': workDomain,
          },
          responseType: responseType,
          isNoHead: true,
          // response: true,
        })
        .then(
          (res) => {
            const { code, message: msg } = res
            let codes = ['0', 'success']
            if (!codes.includes(code) && showMsg) {
              message.error({
                content: msg,
                duration: 5,
              })
            }
            resolve(res)
          }
          // (error) => {
          //   debugger
          //   reject(error)
          // }
        )
        .catch((err) => {
          console.log('err.response.status')
          const status = err?.response?.status || 0
          notification.error({
            description: err.message,
            message: httpCode[status],
          })
        })
    })
  } catch (err) {
    console.log('request-err', err)
  }
}
/**
 * cModelIns.fetch不支持文件流
 * W3C 的 cors 标准对于跨域请求也做了限制，规定对于跨域请求，客户端允许获取的response header字段只限于“simple response header”和“Access-Control-Expose-Headers” ，在“Access-Control-Allow-Headers”中加了无效
 * 解决方案为:在服务器返回的header中添加response.addHeader("Access-Control-Expose-Headers","Content-Type,content-disposition");
 */
export const requestBlob = async (params = {}) => {
  const { url, method = 'POST', param, responseType = 'blob' } = params
  const env = getEnv()
  const fetchUrl = getFetchUrl(env, url)
  const ssokey = getSSOKey()
  let response = {}
  const request = {
    method: method,
    responseType,
    headers: {
      'rsk-sso-token': getCookie(ssokey),
      'Content-Type': 'application/json;charset=UTF-8',
    },
    mode: 'cors',
    body: method === 'GET' ? undefined : JSON.stringify(param),
  }
  if (method === 'GET') {
    const getParam = new URLSearchParams(param).toString()
    response = await fetch(`${fetchUrl}?${getParam}`, request)
  } else {
    response = await fetch(fetchUrl, request)
  }
  if (response.status === 403) {
    notification.error({
      description: '没有权限，请联系管理员，cicfkkf@Ctrip.com',
      message: '没有权限',
    })
    return false
  }
  if (response.status !== 200) {
    notification.error({
      description: '下载失败 请重试！',
      message: '网络异常',
    })
    return false
  }

  let filename = null
  /**
   *  获取文件流，并获取响应头中的文件信息，需要后端跨域支持
   *  否则response.headers 直接去拿 headers，发现是一个 Headers 的空对象
   */
  try {
    filename = response.headers.get('content-disposition').split(';')[1].split('=')[1]
    filename = decodeURIComponent(filename)
  } catch (e) {
    console.log(e)
  }
  const blob = await response.blob()
  const link = document.createElement('a')
  if (filename) {
    link.download = filename
  } else {
    link.download = ''
  }
  link.style.display = 'none'
  link.href = window.URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}



