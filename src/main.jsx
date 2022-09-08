// React 18
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
// import 'antd/dist/antd.less'

// import 'antd/es/style/themes/index.less'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import './index.css'
import '@ant-design/pro-form/dist/form.css'
import '@ant-design/pro-table/dist/table.css'
import '@ant-design/pro-descriptions/dist/descriptions.css'
// import '@ant-design/pro-layout/dist/layout.css'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
let persistor = persistStore(store)

const container = document.getElementById('root')
const root = createRoot(container)
// // 装载
// root.render(
//   <>
//     <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//     <App />
//     </PersistGate>
//     </Provider>
//   </>
// )
// // 卸载
// root.unmount()

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  container
)
