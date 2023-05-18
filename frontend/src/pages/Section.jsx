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
import { AuthContex } from '../contex/AuthContex';

function Section() {

  const { notes, dispatch, BignoteRef, setactive } = useContext(MainContex);
  const { auth } = useContext(AuthContex)

  let { section } = useParams();

  let [isadd, setisadd] = useState(true);

  let load = useRef(null);

  let [sectionInfo, setsectionInfo] = useState(null);
  const [permission, setpermission] = useState(false)

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

      const option = {}
      if (auth) {
        option["headers"] = { 'authorization': auth }
      }
      let res = await fetch(sectionApi + section, option);
      let data = await res.json();
      if (data.success) {
        dispatch({
          type: "SET_NOTE",
          payload: data.msg.notes
        })
        setsectionInfo(data.msg.section)
        setpermission(data.msg.permission)
      } else {
        // navigate("/123/pagenotfound");
      }
      load.current.complete();

    }

    fetchsection();

  }, [section])

  return (

    <div className={auth?"right":"right fullmode"}>
      <LoadingBar color='#5469d4' ref={load} />
      {
        sectionInfo &&
        <>
          <Bignote permission={permission} section={section} isadd={isadd} />

          <SectionIn permission={permission} section={section} sectionInfo={sectionInfo} />

          <Divider />

          {permission ? <div className="addnote">
            <div className="open_note">
              <h3 style={{ marginRight: 10 }}>Add note</h3>
              <div className="add_btn" onClick={openAddnote}>
                <AddCircleIcon style={{ fontSize: '3rem', color: '#5469d4', cursor: "pointer" }} />
              </div>
            </div>
          </div> : null}

          <div className="notes">
            {
              notes?.map((note) => {
                return (
                  <Note
                    permission={permission}
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