import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MainContexProvider from './contex/mainContex'
import LinkProvider from './contex/LinkContex'
import store from './redux/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <LinkProvider>
        <MainContexProvider>
          <App />
        </MainContexProvider>
      </LinkProvider>
  </Provider>

)
