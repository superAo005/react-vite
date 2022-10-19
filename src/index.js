import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Login from '@pages/login/login'
import Admin from '@pages/admin/admin'
import reportWebVitals from './reportWebVitals'
import store from './redux/store'
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading="loading....." persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Routes>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
reportWebVitals()
