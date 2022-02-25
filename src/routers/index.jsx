// routers/index.js
import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'
import Loading from '@/components/Loading'

import { cloneDeep } from 'lodash-es'
const TableList = lazy(() => import('@/pages/table'))
const TemplateList = lazy(() => import('@/pages/table'))
const NoMatch = lazy(() => import('@/pages/noMatch'))
const Login = lazy(() => import('@/pages/login'))
const User = lazy(() => import('@/pages/user'))
const Role = lazy(() => import('@/pages/role'))
const Expert = lazy(() => import('@/pages/expert'))
const Statistic = lazy(() => import('@/pages/statistic'))
const Extract = lazy(() => import('@/pages/extract'))
const Test = lazy(() => import('@/pages/test'))

// import Home from '@/pages/home'
// import Detail from '@/pages/detail'
// import TableList from '@/pages/table'
// import NoMatch from '@/pages/noMatch'

const routeList = [
  {
    path: '',
    element: <LayoutPage />,
    children: [
      {
        path: 'user',
        auth: 'user:view',
        element: (
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        ),
      },

      {
        path: 'role',
        element: (
          <Suspense fallback={<Loading />}>
            <Role />
          </Suspense>
        ),
      },
      {
        path: 'expert',
        element: (
          <Suspense fallback={<Loading />}>
            <Expert />
          </Suspense>
        ),
      },
      {
        path: 'extract',
        element: (
          <Suspense fallback={<Loading />}>
            <Extract />
          </Suspense>
        ),
      },

      {
        path: 'statistic',
        element: (
          <Suspense fallback={<Loading />}>
            <Statistic />
          </Suspense>
        ),
      },
      {
        path: 'table',
        element: (
          <Suspense fallback={<Loading />}>
            <TableList />
          </Suspense>
        ),
      },
      {
        path: 'template',
        element: (
          <Suspense fallback={<Loading />}>
            <TemplateList />
          </Suspense>
        ),
      },
      {
        path: '*',
        name: 'No Match',
        auth: 'static',

        key: '*',
        element: (
          <Suspense fallback={<Loading />}>
            <NoMatch />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'login',
    auth: 'static',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: 'test',
    auth: 'static',
    element: (
      <Suspense fallback={<Loading />}>
        <Test />
      </Suspense>
    ),
  },
]

function filterRoutes(data, predicate) {
  const nodes = cloneDeep(data)
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return
  }
  const newChildren = []
  for (const node of nodes) {
    // debugger
    if (predicate(node)) {
      // 如果自己（节点）符合条件，直接加入到新的节点集
      newChildren.push(node)
      // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
      //   node.children = filterRoutes(node.children, predicate)
    } else {
      // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
      // 根据递归调用 filterRoutes() 的返回值来判断
      const subs = filterRoutes(node.children, predicate)
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node)) {
        node.children = subs
        newChildren.push(node)
      }
    }
  }
  return newChildren
}

const RenderRouter = (props) => {
  const { roles = [] } = props
  let filetRouteList = filterRoutes(routeList, (item) => [...roles, 'static'].includes(item.auth))

  const element = useRoutes(filetRouteList)
  return element
}

export default RenderRouter
