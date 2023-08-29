import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Divider, Tooltip,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinkIcon from '@mui/icons-material/Link';

import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { status } from '../redux/slices/authSlice';
import { setActive, setCopy } from '../redux/slices/noteSlice';
import { closeBig } from '../util/constant';
import { deletenote, updatenote } from '../util/common';

// same component for editing note(big note) and adding new note  

// for editing  note, component should be rendered with old note filled up details

// for adding new note, component should renderd with some default values

function Bignote({ addnote, section, isadd, permission }) {
  const navigate = useNavigate();

  const { authStatus, token } = useSelector((state) => state.auth);
  const { activeNote } = useSelector(state => state.notes);

  const dispatch = useDispatch();

  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  let copyLink = (link) => {
    toast.success("copied")
    navigator.clipboard.writeText(link);
  }

  const resetState = () => {
    settitle("");
    setdesc("");
  }

  useEffect(() => {
    if (isadd) {
      resetState();
    } else {
      settitle(activeNote?.title);
      setdesc(activeNote?.desc);
    }
    // active note change each time when clicking on add button and and clicking on any note
  }, [isadd, activeNote])

  const handleSubmit = async () => {
    if (!permission) return
    if (isadd) {
      let note = {
        title: title == "" ? "undefined" : title,
        desc: desc == "" ? "undefined" : desc,
      }
      addnote(note);
      resetState();
    }
    else {
      let newnote = {
        title: title,
        desc: desc,
      }
      const data = await updatenote(activeNote?._id, newnote, token, dispatch);
      if (data.err) return;
      closeBig();
    }
  }

  const handleDelete = async () => {
    if (!permission) return;
    const data = await deletenote(activeNote?._id, token, dispatch);
    if (data.err) return
    closeBig()
    navigate("/" + section);
  }

  const copyNote = async (note) => {
    dispatch(setCopy(note));
    const tid = toast.success('Note has been copied', {
      duration: Infinity,
      position: "top-right"
    });
    setTimeout(() => {
      toast.dismiss(tid);
      toast((t) => (
        <span>
          Press <b> Paste </b>
          button in section page, in which you want to add this note
          <button className='close-toast' onClick={() => toast.dismiss(t.id)}>
            ok
          </button>
        </span>
      ), {
        duration: 10000,
        position: 'top-right'
      });
    }, 2000);
  }

  const handleBlur = (e) => {
    if (e.target.classList.contains("back")) {
      closeBig();
      dispatch(setActive(null))
    }
  }
  return (

    <div onClick={handleBlur} className="bigNoteRef back"
    >
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

                    <div className="add_big" onClick={handleSubmit}>
                      <Tooltip title='save'>
                        <LibraryAddCheckIcon style={{ cursor: "pointer", color: "blue" }} />
                      </Tooltip>

                    </div>
                    {
                      !isadd ?
                        <>
                          <div className="dlt_big" onClick={handleDelete}>
                            <Tooltip title='delete'>
                              <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                            </Tooltip>
                          </div>
                        </>
                        : null
                    }

                  </> : null
              }


              <div className="big_close" onClick={closeBig}>
                <Tooltip title='close'>
                  <ClearIcon style={{ cursor: "pointer" }} />
                </Tooltip>

              </div>

              <div className="big_back" onClick={closeBig}>
                <Tooltip title='close'>
                  <KeyboardBackspaceIcon style={{ cursor: "pointer" }} />
                </Tooltip>
              </div>

              {isadd ? null :
                <>
                  {
                    authStatus == status.AUTH ? <div className="copy-btn" onClick={() => {
                      copyNote(activeNote)
                    }}>
                      <Tooltip title='copy note'>
                        <ContentCopyIcon style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </div> : null
                  }
                  <div className="open-in-new" onClick={() => navigate("/note/" + activeNote?._id)}>
                    <Tooltip title='open in page'>
                      <OpenInNewIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                  </div>
                  <div className="share-btn" onClick={() => copyLink(location.origin + "/note/" + activeNote._id)}>
                    <Tooltip title='copy link'>
                      <LinkIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                  </div>
                </>
              }

            </div>

          </div>

          {!isadd && <span>{activeNote?.updatedAt?.toString()?.substr(0, 10)}</span>}

        </div>
        <Divider />


        <TextareaAutosize disabled={permission ? false : true} placeholder='your desc'
          value={desc} onChange={(e) => setdesc(e.target.value)}
          minRows={3} />
      </div>
    </div >

  )
}

export default Bignote

