// routers/index.js
import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'
import Loading from '@/components/Loading'

import { filterRoutes } from '@/utils'
import { useSelector } from 'react-redux'
const NoMatch = lazy(() => import('@/pages/noMatch'))
const Login = lazy(() => import('@/pages/login'))
const User = lazy(() => import('@/pages/user'))
const Role = lazy(() => import('@/pages/role'))
const Video = lazy(() => import('@/pages/video'))
const Category = lazy(() => import('@/pages/category'))
const Notice = lazy(() => import('@/pages/notice'))
const Carousel = lazy(() => import('@/pages/carousel'))
const Org = lazy(() => import('@/pages/org'))

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
        path: 'org',
        title: '单位管理',
        auth: 'perms:role:query',
        icon: 'org',
        element: lazyLoad(<Org />),
      },

      {
        path: 'user',
        title: '用户管理',
        icon: 'user',
        auth: 'user:query',
        element: lazyLoad(<User />),
      },
      {
        path: 'role',
        title: '角色管理',
        auth: 'perms:role:query',
        icon: 'team',
        element: lazyLoad(<Role />),
      },

      {
        path: 'video',
        title: '资源库管理',
        icon: 'video',
        auth: 'video:query',
        element: lazyLoad(<Video />),
      },
      {
        path: 'category',
        title: '主题分类',
        icon: 'project',
        auth: 'category:query',
        element: lazyLoad(<Category />),
      },
      {
        path: 'notice',
        title: '法规通知',
        icon: 'notice',
        auth: 'laws:regulations:query',
        element: lazyLoad(<Notice />),
      },

      {
        path: 'carousel',
        title: '轮播图',
        icon: 'picture',
        auth: 'slide:show:query',
        element: lazyLoad(<Carousel />),
      },

      // {
      //   path: 'statistic',
      //   title: '统计分析',
      //   element: lazyLoad(<Statistic />),
      // },
      // {
      //   path: 'components',
      //   title: '组件',
      //   children: [
      //     {
      //       path: 'table',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table2',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table3',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table4',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table5',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table6',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table7',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table9',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'template',
      //       title: 'template',
      //       element: lazyLoad(<TemplateList />),
      //     },
      //   ],
      // },
      // {
      //   path: 'components2',
      //   title: '组件2',
      //   children: [
      //     {
      //       path: 'table',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table2',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table3',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table4',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table5',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table6',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table7',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'table9',
      //       title: '表格',
      //       element: lazyLoad(<TableList />),
      //     },
      //     {
      //       path: 'template',
      //       title: 'template',
      //       element: lazyLoad(<TemplateList />),
      //     },
      //   ],
      // },
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
  roles = useSelector((state) => state?.user?.info?.roles)
  let filetRouteList = filterRoutes(roles, routeList)
  return useRoutes(filetRouteList)
}
export { routeList }
export default RenderRouter
