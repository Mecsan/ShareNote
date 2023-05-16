import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Divider,
  TextField,
  Checkbox
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MainContex } from '../contex/mainContex'
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { noteApi } from '../config/apis';
import toast from 'react-hot-toast';

// same component for editing note(big note) and adding new note  

// for editing  note, component should be rendered with old note filled up details

// for adding new note, component should renderd with some default values

function Bignote({ section, isadd, permission }) {
  const navigate = useNavigate();

  const { dispatch, deletenote, BignoteRef, activenote } = useContext(MainContex);
  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  let updatenote = async (key) => {
    if(!permission) return ;
    let newnote = {
      title: title,
      desc: desc,
    }

    let tid = toast.loading("updating note");

    let res = await fetch(`${noteApi}${key}`, {
      method: "PUT",
      headers: {
        'authorization': localStorage.getItem('noteAuth'),
        'Content-Type': "application/json"
      },
      body: JSON.stringify(newnote)
    })
    let data = await res.json();

    if (data.success) {
      dispatch({
        type: "UP_NOTE",
        key: key,
        payload: data.msg
      })
      BignoteRef.current.classList.remove('back_active');
      toast.success("note updated", {
        id: tid,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })

    }
  }

  let addnote = async () => {
    if(!permission) return
    let tid = toast.loading("adding note");

    let note = {
      title: title == "" ? "undefined" : title,
      desc: desc == "" ? "undefined" : desc,
    }

    let res = await fetch(noteApi + section, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': localStorage.getItem('noteAuth')
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
    BignoteRef.current.classList.remove('back_active');

  }

  let closeBig = () => {
    BignoteRef.current.classList.remove('back_active');
  }

  useEffect(() => {
    if (activenote) {
      settitle(activenote.title);
      setdesc(activenote.desc);
    }
    // active note change each time when clicking on add button and and clicking on any note
  }, [activenote])


  return (

    <div ref={BignoteRef} onClick={(e) => {
      if (e.target.classList.contains("back")) {
        closeBig();
      }
    }} className="back"
    >

      {activenote &&
        <div className="bignote">
          <div className="big_top">
            <div className="big_title">

              <input disabled={permission ? false : true} placeholder='title' type="text" value={title} onChange={(e) => {
                settitle(e.target.value)
              }} className="t_title" />


              <div className="big_btn_grp">
                {
                  permission ?
                    <>

                      <div className="add_big" onClick={() => { isadd ? addnote() : updatenote(activenote?._id) }}>
                        <LibraryAddCheckIcon style={{ cursor: "pointer", color: "blue" }} />
                      </div>
                      {
                        !isadd ?

                          <div className="dlt_big" onClick={() => {
                            deletenote(activenote?._id,permission)
                            navigate("/" + section);
                          }
                          }>
                            <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                          </div> : null
                      }
                    </> : null
                }


                <div className="big_close" onClick={closeBig}>
                  <ClearIcon style={{ cursor: "pointer" }} />
                </div>

                <div className="big_back" onClick={closeBig}>
                  <KeyboardBackspaceIcon style={{ cursor: "pointer" }} />
                </div>

              </div>

            </div>

            {!isadd && <span>{activenote?.updatedAt?.toString()?.substr(0, 10)}</span>}

          </div>
          <Divider />


          <TextareaAutosize disabled={permission ? false : true} placeholder='your desc'
            value={desc} onChange={(e) => setdesc(e.target.value)}
            minRows={3} />

        </div>
      }

    </div >

  )
}

export default Bignote

