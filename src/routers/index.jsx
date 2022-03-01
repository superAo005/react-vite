// routers/index.js
import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'
import Loading from '@/components/Loading'

import { filterRoutes } from '@/utils'
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
        title: '用户管理',
        auth: 'user:view',
        element: (
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        ),
      },

      {
        path: 'role',
        title: '角色管理',
        auth: 'role:view',

        element: (
          <Suspense fallback={<Loading />}>
            <Role />
          </Suspense>
        ),
      },
      {
        path: 'expert',
        title: '专家管理',
        auth: 'expert:view',

        element: (
          <Suspense fallback={<Loading />}>
            <Expert />
          </Suspense>
        ),
      },
      {
        path: 'extract',
        title: '专家抽取',
        auth: 'extract:view',
        element: (
          <Suspense fallback={<Loading />}>
            <Extract />
          </Suspense>
        ),
      },

      {
        path: 'statistic',
        title: '统计分析',
        element: null,
      },
      {
        path: 'components',
        title: '组件',
        children: [
          {
            path: 'table',
            title: '表格',
            element: (
              <Suspense fallback={<Loading />}>
                <TableList />
              </Suspense>
            ),
          },
        ],
      },
      // {
      //   path: 'table',
      //   element: (
      //     <Suspense fallback={<Loading />}>
      //       <TableList />
      //     </Suspense>
      //   ),
      // },
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
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: 'test',
    element: (
      <Suspense fallback={<Loading />}>
        <Test />
      </Suspense>
    ),
  },
]

// function filterRoutes(data, predicate) {
//   const nodes = cloneDeep(data)
//   // 如果已经没有节点了，结束递归
//   if (!(nodes && nodes.length)) {
//     return
//   }
//   const newChildren = []
//   for (const node of nodes) {
//     if (predicate(node)) {
//       // 如果自己（节点）符合条件，直接加入到新的节点集
//       newChildren.push(node)
//       // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
//       //   node.children = filterRoutes(node.children, predicate)
//     } else {
//       // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
//       // 根据递归调用 filterRoutes() 的返回值来判断
//       const subs = filterRoutes(node.children, predicate)
//       // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
//       // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
//       // 2. 自己本身符合条件
//       if ((subs && subs.length) || predicate(node)) {
//         node.children = subs
//         newChildren.push(node)
//       }
//     }
//   }
//   return newChildren
// }

const RenderRouter = (props) => {
  let { roles = [] } = props
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  roles = userInfo?.roles || []
  console.log('RenderRouter', roles)
  let filetRouteList = filterRoutes(
    roles,
    routeList
    // (item) => (!item.auth && !(item?.children?.length > 0)) || [...roles].includes(item.auth)
    // (item) => {
    //   if (!item.auth && !item?.children) {
    //     return true
    //   } else {
    //     return [...roles].includes(item.auth)
    //   }
    // }
  )
  console.log('filetRouteList', filetRouteList)
  return useRoutes(filetRouteList)
  // const Element = useRoutes(filetRouteList)
  // return (
  //   <Suspense fallback={<Loading />}>
  //     {Element}
  //   </Suspense>
  // )
}
export { routeList }
export default RenderRouter
