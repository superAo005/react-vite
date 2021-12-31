// routers/index.js
import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'

const Home = lazy(() => import('@/pages/home'))
const Detail = lazy(() => import('@/pages/detail'))

const routeList = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'detail',
        element: <Detail />,
      },
    ],
  },
]

const RenderRouter = () => {
  const element = useRoutes(routeList)
  return element
}

export default RenderRouter
