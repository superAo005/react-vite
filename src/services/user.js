/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

// 登录
export function login(data) {
  return post({
    url: 'api/hn/bpsa/auth/to/login',
    data,
  })
}

// 登出
export function logout(data) {
  return post({
    url: 'api/hn/bpsa/auth/to/login/out',
    data,
  })
}

//  获取表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/user/info/query/paging',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hn/bpsa/user/info/add',
    data,
  })
}

// 编辑
export function edit(data) {
  return post({
    url: 'api/hn/bpsa/user/info/update',
    data,
    showMsg: 'notification',
  })
}

// 删除
export function del(uid) {
  return post({
    url: 'api/hn/bpsa/user/info/del',
    data: { uid },
  })
}

// 查看
export function view(uid) {
  return post({
    url: 'api/hn/bpsa/user/info/query',
    data: { uid },
  })
}
