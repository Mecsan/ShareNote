import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Note from '../compo/note';
import SectionIn from '../compo/section';
import { MainContex } from '../contex/mainContex'
import Bignote from '../compo/bignote'
import { noteApi, sectionApi } from '../config/apis'
import LoadingBar from 'react-top-loading-bar'
import { AuthContex } from '../contex/AuthContex';
import toast from 'react-hot-toast';



function Section() {

  const { notes, dispatch, openBig, setactive, copynote, setcopy, closeBig } = useContext(MainContex);
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
    openBig();
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
        navigate("/123/pagenotfound");
      }
      if (load.current) {
        load.current.complete();
      }
    }

    fetchsection();

  }, [section])

  let addnote = async (note) => {
    let tid = toast.loading("adding note");

    let res = await fetch(noteApi + section, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': auth
      },
      body: JSON.stringify(note)
    })

    let data = await res.json();
    if (data.success) {
      dispatch({
        type: "ADD_NOTE",
        payload: data.msg
      })
      toast.success('note added', {
        id: tid,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      toast.error("some error occured", { id: tid })
    }

    closeBig();
  }

  const handlePaste = () => {
    let newNote = { title: copynote.title, desc: copynote.desc }
    addnote(newNote);
    setcopy({ isCopy: false, title: "", desc: "" })
  }


  return (

    <div className="right">
      <LoadingBar color='#5469d4' ref={load} />
      {
        sectionInfo &&
        <>
          <Bignote addnote={addnote} permission={permission} section={section} isadd={isadd} />

          <SectionIn
            permission={permission}
            section={section}
            sectionInfo={sectionInfo} />

          <Divider />

          {permission ?
            <div className="note-option">

              <div className="addnote">
                <div className="open_note">
                  <h3 style={{ marginRight: 10 }}>Add note</h3>
                  <div className="add_btn" onClick={openAddnote}>
                    <AddCircleIcon style={{ fontSize: '3rem', color: '#5469d4', cursor: "pointer" }} />
                  </div>
                </div>
              </div>

              {copynote.isCopy ? <div className="paste-note" onClick={handlePaste}>
                <Tooltip title='Paste note in this section'>
                  <Button color="primary">
                    paste
                  </Button>
                </Tooltip>
              </div> : null}

            </div>
            : null}

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