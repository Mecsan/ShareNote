import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContex } from '../contex/AuthContex'

function Notfound() {
  const { auth } = useContext(AuthContex);
  return (
    <div className='notfound'>
      {!auth  && <Navigate to='login' />}
      <h1>404</h1>
      Not found
    </div>
  )
}

export default Notfound