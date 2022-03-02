import React, { Suspense } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import RenderRouter from './routers'
import LoadingComponent from '@/components/Loading'
import { useSelector } from 'react-redux'

const App = () => {
  const userInfo = useSelector((state) => state.user.info)

  return (
    <BrowserRouter>
      {/* <Suspense fallback={<LoadingComponent />}> */}
      <RenderRouter userInfo={userInfo} roles={userInfo?.roles} />
      {/* </Suspense> */}
    </BrowserRouter>
  )
}

export default App
