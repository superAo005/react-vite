import React, { Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import RenderRouter from './routers'
import LoadingComponent from '@/components/Loading'

const App = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </HashRouter>
  )
}

export default App
