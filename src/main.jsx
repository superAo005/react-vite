import ReactDOM from 'react-dom'
// import 'antd/dist/antd.less'

// import 'antd/es/style/themes/index.less'

import './index.css'
import '@ant-design/pro-form/dist/form.css'
import '@ant-design/pro-table/dist/table.css'
import '@ant-design/pro-descriptions/dist/descriptions.css'
// import '@ant-design/pro-layout/dist/layout.css'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
