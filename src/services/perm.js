/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取表格列表
export function getPageList(data) {
  return post({
    url: '/api/hn/bpsa/perm/role/list/all/query',
    data,
  })
}

//  获取权限列表
export function getPermList(data) {
  return post({
    url: '/api/hn/bpsa/perm/list/all/query',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: '/api/hn/bpsa/perm/role/add',
    data,
  })
}

// 编辑
export function update(data) {
  return post({
    url: '/api/hn/bpsa/perm/role/update',
    data,
    showMsg: 'notification',
  })
}

// 删除
export function del(u_id) {
  return post({
    url: '/api/hn/bpsa/perm/role/del',
    data: { u_id },
  })
}
