/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/notify/laws/regs/info/query/paging',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hn/bpsa/notify/laws/regs/info/add',
    data,
  })
}

// 编辑
export function update(data) {
  return post({
    url: 'api/hnbc/psas/user/edit',
    data,
    showMsg: 'notification',
  })
}

// 删除
export function del(id) {
  return post({
    url: 'api/hn/bpsa/notify/laws/regs/info/del',
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
