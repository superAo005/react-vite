/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取表格列表
export function getPageList(data) {
  return post({
    url: 'api/hnbc/psas/user/list/query',
    data,
  })
}

// 登录
export function login(data) {
  return post({
    url: 'api/hnbc/psas/auth/to/login',
    data,
  })
}
// 新增
export function create(data) {
  return post({
    url: 'api/hnbc/psas/user/add',
    data,
  })
}

// 编辑
export function edit(data) {
  return post({
    url: 'api/hnbc/psas/user/edit',
    data,
    showMsg: 'notification',
  })
}

// 编辑
export function del(u_id) {
  return post({
    url: 'api/hnbc/psas/user/del',
    data: { u_id },
  })
}

// 查看
export function view(param) {
  return get({
    url: `featureFunction/detail`,
    param,
  })
}
// 删除
export function deleteFeatureFunction(param) {
  return post({
    url: 'featureFunction/delete',
    param,
  })
}
// 申请上下线
export function enableFeatureFunction(param) {
  return post({
    url: 'featureFunction/enable',
    param,
  })
}
