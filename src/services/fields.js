/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取表格列表
export function getPageList(data) {
  return post({
    url: 'api/hnbc/psas/dict/expertise/list/query',
    data,
  })
}

//  获取表格列表
export function getList(data) {
  return post({
    url: 'api/hnbc/psas/dict/expertise/list',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hnbc/psas/dict/expertise/add',
    data,
  })
}

// 编辑
export function edit(data) {
  return post({
    url: 'api/hnbc/psas/dict/expertise/edit',
    data,
    showMsg: 'notification',
  })
}

// 编辑
export function del(id) {
  return post({
    url: 'api/hnbc/psas/dict/expertise/del',
    data: { id },
  })
}

// 查看
export function view(param) {
  return get({
    url: `featureFunction/detail`,
    param,
  })
}
