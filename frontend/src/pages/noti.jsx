import React, { useContext } from 'react'
import { MainContex } from '../contex/mainContex'
import { Noti as Noticom } from '../compo/noti'
import BigTask from '../compo/bigTask';

function Noti() {
  const { notis } = useContext(MainContex);

  return (
    <div className="right">
      <h2>Notifications :</h2>

      <BigTask noti={true} />

      <div className='tasks'>
        {
          notis && notis.map((noti) => {
            return <Noticom key={noti._id} noti={noti}  />
          })
        }
      </div>

    </div>
  )
}

export default Noti