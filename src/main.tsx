import React, { Suspense, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import axios, { AxiosContext } from './api/request'

import './index.css'
import App from './App'
import { ErrorBoundary } from 'react-error-boundary'
import SuspendFallbackLoading from './pages/layout/suspendFallbackLoading'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
})

const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const axiosValue = useMemo(() => {
    return axios
  }, [])

  return <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>
}

ReactDOM.render(
  // <React.StrictMode>
  <AxiosProvider>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div
              style={{
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
              }}>
              <h3>出错了! </h3>
              <Button onClick={() => resetErrorBoundary()}>再来一次</Button>
              <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
            </div>
          )}>
          <Suspense fallback={<SuspendFallbackLoading />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </RecoilRoot>
    </QueryClientProvider>
  </AxiosProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
)
