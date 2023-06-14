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
import { MainContex } from '../contex/mainContex'
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import toast from 'react-hot-toast';
import { AuthContex } from '../contex/AuthContex';

// same component for editing note(big note) and adding new note  

// for editing  note, component should be rendered with old note filled up details

// for adding new note, component should renderd with some default values

function Bignote({ addnote, section, isadd, permission }) {
  const navigate = useNavigate();

  const { deletenote, updateNote, activenote, setactive, setcopy, closeBig } = useContext(MainContex);

  const { auth } = useContext(AuthContex)
  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  let copyLink = (link) => {
    toast.success("copied")
    navigator.clipboard.writeText(link);
  }

  useEffect(() => {
    if (activenote) {
      settitle(activenote.title);
      setdesc(activenote.desc);
    }
    // active note change each time when clicking on add button and and clicking on any note
  }, [activenote])

  const handleSubmit = async () => {
    if (!permission) return
    if (isadd) {
      let note = {
        title: title == "" ? "undefined" : title,
        desc: desc == "" ? "undefined" : desc,
      }
      addnote(note);
    }
    else {
      let newnote = {
        title: title,
        desc: desc,
      }
      const data = await updateNote(activenote?._id, newnote);
      if (data?.success) {
        closeBig()
      }
    }
  }

  const handleDelete = async () => {
    if (!permission) return;
    const data = await deletenote(activenote?._id)
    if (data?.success) {
      closeBig()
      navigate("/" + section);
    }
  }


  const copyNote = async (note) => {
    setcopy({
      isCopy: true,
      title: note.title,
      desc: note.desc
    })
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
      setactive(null)
    }

  }
  return (

    <div onClick={handleBlur} className="bigNoteRef back"
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
                      auth ? <div className="copy-btn" onClick={() => {
                        copyNote(activenote)
                      }}>
                        <Tooltip title='copy note'>
                          <ContentCopyIcon style={{ cursor: "pointer" }} />
                        </Tooltip>
                      </div> : null
                    }
                    <div className="open-in-new" onClick={() => navigate("/note/" + activenote?._id)}>
                      <Tooltip title='open in page'>
                        <OpenInNewIcon style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </div>
                    <div className="share-btn" onClick={() => copyLink(location.origin + "/note/" + activenote._id)}>
                      <Tooltip title='copy link'>
                        <LinkIcon style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </div>
                  </>
                }

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

