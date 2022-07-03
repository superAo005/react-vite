/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取视频表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/slide/show/home/page/list/query',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hn/bpsa/slide/show/info/add',
    data,
  })
}

// 编辑更新
export function update(data) {
  return post({
    url: 'api/hn/bpsa/slide/show/info/update',
    data,
    showMsg: 'notification',
  })
}

// 编辑
export function del(id) {
  return post({
    url: 'api/hn/bpsa/slide/show/info/del',
    data: { id },
  })
}
