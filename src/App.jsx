import React, { Suspense } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import RenderRouter from './routers'
import LoadingComponent from '@/components/Loading'

const App = () => {
  const handleChange = (val) => {
    // console.log(val)
  }
  const editorDidMount = (editor, monaco) => {
    // console.log(editor, monaco)
  }
  return (
    <HashRouter>
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </HashRouter>
  )
}

export default App
