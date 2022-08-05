/**
 * 单位
 */
import { get, post } from './request'

//  获取视频表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/orgInfo/info/query/paging',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hn/bpsa/orgInfo/info/add',
    data,
  })
}

// 编辑更新
export function update(data) {
  return post({
    url: 'api/hn/bpsa/video/info/update',
    data,
    showMsg: 'notification',
  })
}

// 编辑
export function del(id) {
  return post({
    url: 'api/hn/bpsa/orgInfo/info/del',
    data: { id },
  })
}

// 查看
export function view(id) {
  return post({
    url: `api/hn/bpsa/orgInfo/info/query`,
    data: { id },
  })
}
