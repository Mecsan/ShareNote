import React, { useContext, useEffect } from 'react'
import Signin from './pages/signin'
import Login from './pages/login'
import Section from './pages/Section'
import './css/app.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Notfound from './pages/notfound'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Auth from './compo/Auth'
import Note from './pages/note'
import Loading from './compo/loading'
import { useDispatch, useSelector } from 'react-redux'
import { verify } from './services/auth'
import { logout, setStatus, setUser, status } from './redux/slices/authSlice'
import { toastConfig } from './util/constant'
import { themes } from './redux/slices/themSlice'

function App() {
  const auth = useSelector((state) => state.auth);
  const { theme } = useSelector(state => state.theme)
  const dispatch = useDispatch();

  let fetchUserinfo = async () => {
    let data = await verify(auth.token);
    if (data.err) {
      dispatch(logout());
      localStorage.removeItem('noteAuth');
    } else {
      dispatch(setStatus(status.AUTH));
      dispatch(setUser(data.msg));
    }
  }

  useEffect(() => {
    if (auth.token) {
      fetchUserinfo();
    } else {
      dispatch(setStatus(status.NOAUTH));
    }
  }, [auth.token])

  return (
    <>
      {
        auth.authStatus == status.UNVERIFIED ? <Loading /> :
          <>
            <Toaster
              position={toastConfig.position}
              reverseOrder={false}
              toastOptions={
                { style: toastConfig.lightToast }
              }
            />
            <div className={theme == themes.LIGHT ? "main" : "main dark"}>
              {
                <Router>
                  <Routes>
                    <Route path='/signup' element={<Signin />} />
                    <Route path='/login' element={<Login />} />

                    <Route path="/" element={
                      <Auth />
                    }>
                      <Route path='/' element={<Home />} />
                      <Route path='/:section' element={<Section />} />
                      <Route path='/note/:noteId' element={<Note />} />
                      <Route path='*' element={<Notfound />} />
                    </Route>
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