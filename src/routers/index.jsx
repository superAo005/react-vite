// routers/index.js
import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'
import Loading from '@/components/Loading'

import { filterRoutes } from '@/utils'
const TableList = lazy(() => import('@/pages/table'))
const TemplateList = lazy(() => import('@/pages/table'))
const NoMatch = lazy(() => import('@/pages/noMatch'))
const Login = lazy(() => import('@/pages/login'))
const User = lazy(() => import('@/pages/user'))
const Role = lazy(() => import('@/pages/role'))
const Expert = lazy(() => import('@/pages/expert'))
const Statistic = lazy(() => import('@/pages/statistic'))
const Extract = lazy(() => import('@/pages/extract'))

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children) => {
  return <Suspense fallback={Loading}>{children}</Suspense>
}

const routeList = [
  {
    path: '',
    element: <LayoutPage />,
    children: [
      {
        path: 'user',
        title: '用户管理',
        icon: 'user',
        auth: 'user:view',
        element: lazyLoad(<User />),
      },

      {
        path: 'role',
        title: '角色管理',
        auth: 'role:view',
        icon: 'team',
        element: lazyLoad(<Role />),
      },
      {
        path: 'expert',
        title: '专家管理',
        auth: 'expert:view',

        element: lazyLoad(<Expert />),
      },
      {
        path: 'extract',
        title: '专家抽取',
        auth: 'extract:view',
        element: lazyLoad(<Extract />),
      },

      {
        path: 'statistic',
        title: '统计分析',
        element: lazyLoad(<Statistic />),
      },
      {
        path: 'components',
        title: '组件',
        children: [
          {
            path: 'table',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table2',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table3',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table4',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table5',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table6',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table7',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table9',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'template',
            title: 'template',
            element: lazyLoad(<TemplateList />),
          },
        ],
      },
      {
        path: 'components2',
        title: '组件2',
        children: [
          {
            path: 'table',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table2',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table3',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table4',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table5',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table6',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table7',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'table9',
            title: '表格',
            element: lazyLoad(<TableList />),
          },
          {
            path: 'template',
            title: 'template',
            element: lazyLoad(<TemplateList />),
          },
        ],
      },
      {
        path: '*',
        name: 'No Match',
        key: '*',
        element: lazyLoad(<NoMatch />),
      },
    ],
  },
  {
    path: 'login',
    element: lazyLoad(<Login />),
  },
]

const RenderRouter = (props) => {
  let { roles = [] } = props
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  roles = userInfo?.roles || []
  let filetRouteList = filterRoutes(roles, routeList)
  return useRoutes(filetRouteList)
}
export { routeList }
export default RenderRouter
