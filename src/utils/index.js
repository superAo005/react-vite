import { cloneDeep } from 'lodash-es'

const filterBy = (item, roles = []) => {
  if (!item.auth && !item?.children) {
    return true
  } else {
    return [...roles].includes(item.auth)
  }
}
export function filterRoutes(roles, data, predicate = filterBy) {
  const nodes = cloneDeep(data)
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return
  }
  const newChildren = []
  for (const node of nodes) {
    if (predicate(node, roles)) {
      // 如果自己（节点）符合条件，直接加入到新的节点集
      newChildren.push(node)
      // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
      //   node.children = filterRoutes(node.children, predicate)
    } else {
      // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
      // 根据递归调用 filterRoutes() 的返回值来判断
      const subs = filterRoutes(roles, node.children, predicate)
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node, roles)) {
        node.children = subs
        newChildren.push(node)
      }
    }
  }
  return newChildren
}
export function filterMenuRoutes(roles, data, predicate = filterBy) {
  const nodes = cloneDeep(data)
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return
  }
  const newChildren = []
  for (const node of nodes) {
    if (predicate(node, roles)) {
      // 如果自己（节点）符合条件，直接加入到新的节点集
      newChildren.push(node)
      // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
      //   node.children = filterRoutes(node.children, predicate)
    } else {
      // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
      // 根据递归调用 filterRoutes() 的返回值来判断
      const subs = filterMenuRoutes(roles, node.children, predicate)
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node, roles)) {
        subs.forEach((item) => {
          if (node.path && node.path[0] !== '/') {
            item.path = '/' + node.path + '/' + item.path
          } else {
            item.path = node.path + '/' + item.path
          }
        })
        node.children = subs
        newChildren.push(node)
      }
    }
  }
  return newChildren
}

export const base_url = 'http://39.105.10.134:8999/api/hn/bpsa'
