import React from 'react'
import ReactDOM from 'react-dom'
// import { createRoot } from 'react-dom/client'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import App from './app'
import store from './stores'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
let persistor = persistStore(store)
const container = document.getElementById('root')
// const root = createRoot(container)

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>,
	container
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
