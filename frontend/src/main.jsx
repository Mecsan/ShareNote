import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MainContexProvider from './contex/mainContex'
import store from './redux/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MainContexProvider>
      <App />
    </MainContexProvider>
  </Provider>
)
