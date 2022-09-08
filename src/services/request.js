import axios from 'axios'
import { message } from 'antd'

//创建一个axios示例
// FormData 使用 ,json格式不用引入
// import qs from "qs";
// 用户请求设置的方法
const service = axios.create({
  timeout: 25000,
})

// 设置拦截器

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    return config
  },
  (err) => Promise.reject(err)
)

// 设置响应拦截器
service.interceptors.response.use(
  ({ data }) => {
    console.log(data)

    if (data.res != 1) {
      message.error(data.msg)
    }

    return Promise.resolve(data)
  },
  (err) => {
    switch (err.response.status) {
      case 401:
        sessionStorage.clear()
        // location.hash = '/login'
        break
      case 404:
        message.error(err.message)

        break
      case 500:
        message.error(err.message)
        break
      case 502:
        message.error(err.message)
    }
    return Promise.reject(err)
  }
)

export const get = (opts) => {
  const defaultOptions = {
    method: 'GET',
    url: '',
    data: {},
    params: {},
  }
  const options = Object.assign({}, defaultOptions, opts)
  return service(options)
}

export const post = (opts) => {
  const defaultOptions = {
    method: 'POST',
    url: '',
    data: {},
    params: {},
  }
  const options = Object.assign({}, defaultOptions, opts)
  return service(options)
}

export default service
