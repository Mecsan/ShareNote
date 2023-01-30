import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MainContexProvider from './contex/mainContex'
import AuthProvider from './contex/AuthContex'
import LinkProvider from './contex/LinkContex'
 
ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <LinkProvider>
        <MainContexProvider>
          <App />
        </MainContexProvider>
      </LinkProvider>
    </AuthProvider>
)
