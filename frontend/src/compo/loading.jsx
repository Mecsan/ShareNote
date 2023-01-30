import { CircularProgress } from '@mui/material'
import React from 'react'

function Loading() {
  return (
    <div className='loading'>
      <CircularProgress />
    </div>
  )
}

export default Loading