import React, { useContext } from 'react'
import Signin from './pages/signin'
import Login from './pages/login'
import Section from './pages/Section'
import './css/app.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Notfound from './pages/notfound'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Auth from './compo/Auth'
import { AuthContex } from './contex/AuthContex'
import Note from './pages/note'
import Loading from './compo/loading'

function App() {
  const { loading } = useContext(AuthContex)
  return (
    <>
      {
        loading ?  <Loading /> :
          <>
            <Toaster
              position="bottom-center"
              reverseOrder={false}
            />
            <div className='main'>
              {
                <Router>
                  <Routes>
                    <Route path='/signup' element={<Signin />} />
                    <Route path='/login' element={<Login />} />

                    <Route path="/" element={
                      <>
                        <Auth />
                      </>
                    }>
                      <Route path='/' element={<Home />} />
                      <Route path='/:section' element={<Section />} />
                      <Route path='/note/:noteId' element={<Note />} />
                    </Route>

                    <Route path='*' element={<Notfound />} />
                  </Routes>
                </Router>
              }
            </div>
          </>
      }
    </>
  )
}
export default App