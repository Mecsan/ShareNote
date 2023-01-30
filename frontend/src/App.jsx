import React from 'react'
import Signin from './pages/signin'
import Login from './pages/login'
import Dir from './pages/Dir'
import './css/app.css'
import Noti from './pages/noti'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Nav from './compo/nav'
import Notfound from './pages/notfound'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Auth from './compo/Auth'

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className='main'>
        {
          <Router>
            <Routes>
              <Route path="/" element={
                <>
                  <Auth />
                  <Nav />
                  <Outlet />
                </>
              }>
                <Route path='/' element={<Home />} />
                <Route path='/notification' element={<Noti />} />
                <Route path='/:folder' element={<Dir />} />
              </Route>

              <Route path='signup' element={<Signin />} />
              <Route path='login' element={<Login />} />

              <Route path='*' element={<Notfound />} />
            </Routes>
          </Router>
        }
      </div>
    </>
  )
}

export default App