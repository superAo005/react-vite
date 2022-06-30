/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取所有视频分类表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/dict/video/category/info/query/all',
    data,
  })
}

// 查看
export function view(param) {
  return get({
    url: `featureFunction/detail`,
    param,
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
