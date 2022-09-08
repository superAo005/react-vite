import React from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import RenderRouter from './routers'
import { useSelector } from 'react-redux'

const App = () => {
  const userInfo = useSelector((state) => state.user.info)
  return (
    <BrowserRouter>
      <RenderRouter userInfo={userInfo} roles={userInfo?.roles} />
    </BrowserRouter>
  )
}

export default App