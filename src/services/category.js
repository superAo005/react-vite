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
    url: 'api/hn/bpsa/dict/video/category/info/add',
    data,
  })
}

// 更新编辑
export function update(data) {
  return post({
    url: 'api/hn/bpsa/dict/video/category/info/update',
    data,
    showMsg: 'notification',
  })
}

// 删除
export function del(id) {
  return post({
    url: 'api/hn/bpsa/dict/video/category/info/del',
    data: { id },
  })
}
