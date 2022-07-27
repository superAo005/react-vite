/**
 * 自定义决策相关接口
 */
import { get, post } from './request'

//  获取视频表格列表
export function getPageList(data) {
  return post({
    url: 'api/hn/bpsa/video/info/query/paging',
    data,
  })
}

// 新增
export function create(data) {
  return post({
    url: 'api/hn/bpsa/video/info/add',
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
    url: 'api/hn/bpsa/video/info/del',
    data: { id },
  })
}

// 查看
export function view(id) {
  return post({
    url: `api/hn/bpsa/video/info/query`,
    data: { id },
  })
}
// 分片上传
export function sliceUpload(data) {
  return post({
    url: `api/hn/bpsa/common/file/slice/upload`,
    data,
  })
}
