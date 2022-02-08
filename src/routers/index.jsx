// routers/index.js
import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'

const Home = lazy(() => import('@/pages/home'))
const Detail = lazy(() => import('@/pages/detail'))
const TableList = lazy(() => import('@/pages/table'))
const NoMatch = lazy(() => import('@/pages/noMatch'))

const routeList = [
  {
    path: '',
    element: <LayoutPage />,
    children: [
      {
        path: '/',
        // index: true,
        element: <Home />,
      },
      {
        path: 'detail',
        element: <Detail />,
      },
      {
        path: 'table',
        element: <TableList />,
      },
      {
        path: '*',
        name: 'No Match',
        key: '*',
        element: <NoMatch />,
      },
    ],
  },
]

const RenderRouter = () => {
  const element = useRoutes(routeList)
  return element
}

export default RenderRouter
