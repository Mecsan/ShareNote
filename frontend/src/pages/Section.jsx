import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Note from '../compo/note';
import SectionIn from '../compo/section';
import { MainContex } from '../contex/mainContex'
import Bignote from '../compo/bignote'
import { sectionApi } from '../config/apis'
import LoadingBar from 'react-top-loading-bar'

function Section() {

  const { notes, dispatch, BignoteRef, setactive } = useContext(MainContex);

  let { section } = useParams();

  let [isadd, setisadd] = useState(true);

  let load = useRef(null);

  let [sectionInfo, setsectionInfo] = useState(null);


  let navigate = useNavigate();

  // i am using same component for adding new note and for updating or see (big note)
  // so to differeciate between adding & updating i am using isadd

  let openAddnote = () => {
    setisadd(true);
    setactive({ title: "", desc: "" });
    BignoteRef.current.classList.add('back_active');
  }

  useEffect(() => {

    let fetchsection = async () => {
      load.current.staticStart();

      let res = await fetch(sectionApi + section, {
        headers: { 'authorization': localStorage.getItem('noteAuth') }
      }
      );
      let data = await res.json();
      if (data.success) {
        dispatch({
          type: "SET_NOTE",
          payload: data.msg.notes
        })
        setsectionInfo(data.msg.section)
      } else {
        navigate("/123/pagenotfound");
      }
      load.current.complete();

    }

    fetchsection();

  }, [section])

  return (

    <div className="right">
      <LoadingBar color='#5469d4' ref={load} />
      {
        sectionInfo &&
        <>
          <Bignote section={section} isadd={isadd} />

          <SectionIn section={section} sectionInfo={sectionInfo} />

          <Divider />

          <div className="addnote">
            <div className="open_note">
              <h3 style={{ marginRight: 10 }}>Add note</h3>
              <div className="add_btn" onClick={openAddnote}>
                <AddCircleIcon style={{ fontSize: '3rem', color: '#5469d4', cursor: "pointer" }} />
              </div>
            </div>
          </div>

          <div className="notes">
            {
              notes?.map((note) => {
                return (
                  <Note
                    key={note._id}
                    note={note}
                    setisadd={setisadd}
                  />
                )
              })
            }
          </div>
        </>
      }
    </div>


  )
}

export default Section