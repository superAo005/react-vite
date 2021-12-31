import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
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
    <BrowserRouter>
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
