// routers/index.js
import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import LayoutPage from '@/layout'
import Loading from '@/components/Loading'

const Home = lazy(() => import('@/pages/home'))
const Detail = lazy(() => import('@/pages/detail'))
const TableList = lazy(() => import('@/pages/table'))
const TemplateList = lazy(() => import('@/pages/table'))
const NoMatch = lazy(() => import('@/pages/noMatch'))
const Login = lazy(() => import('@/pages/login'))
const User = lazy(() => import('@/pages/user'))
const Expert = lazy(() => import('@/pages/expert'))

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
        path: '/',
        // index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'user',
        element: (
          <Suspense fallback={<Loading />}>
            <User />
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
]

const RenderRouter = () => {
  const element = useRoutes(routeList)
  return element
}

export default RenderRouter
