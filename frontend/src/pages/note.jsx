import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { noteApi } from '../config/apis'
import { AuthContex } from '../contex/AuthContex'
import Owner from '../compo/Owner';
import { MainContex } from '../contex/mainContex';
import LinkIcon from '@mui/icons-material/Link';
import {
    Tooltip,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
function Note() {

    const navigate = useNavigate();

    const debounceDelay = 2000;

    const { auth } = useContext(AuthContex)
    const { deletenote, updateNote } = useContext(MainContex)

    const { noteId } = useParams();

    const [note, setnote] = useState(null);
    const [permission, setpermission] = useState(false);
    const [time, settime] = useState(null)

    const fetchNote = async (key) => {
        const option = {}
        if (auth) {
            option["headers"] = { 'authorization': auth }
        }
        const res = await fetch(noteApi + key, option);
        const data = await res.json();
        if (data.success) {
            setnote(data.msg.data);
            setpermission(data.msg.permission);
        } else {
            navigate("/123/page");
        }
    }

    let copyLink = (link) => {
        toast.success("copied")
        navigator.clipboard.writeText(link);
    }

    const handledelet = async () => {
        if (!permission) return
        const data = await deletenote(note?._id)
        if (!data) return;
        if (data.success) {
            navigate("/");
        }
    }

    const handleChange = async (e) => {
        if (!permission) return;
        let newnote = {
            title: note.title,
            desc: note.desc
        }
        newnote[e.target.name] = e.target.value;
        setnote((pre) => ({ ...pre, ...newnote }));

        //debouncing
        clearTimeout(time);
        const timeId = setTimeout(() => updateNote(note._id, newnote), debounceDelay);
        settime(timeId)
    }


    useEffect(() => {
        fetchNote(noteId)
    }, [noteId])

    return (
        <div className={auth ? "right" : "right fullmode"}>
            {
                note ?
                    <div className="task-page">
                        {permission ? null : <Owner name={note.section.user.name} />}
                        <div className="title" >
                            <input name='title' disabled={permission ? false : true} value={note.title || ''} onChange={handleChange} className='f_title' type="text" />

                            <div className="big_btn_grp">

                                {
                                    permission ?
                                        <div className="dlt_note" onClick={handledelet}>
                                            <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                                        </div> : null
                                }
                                {
                                    auth ? <div className="copy-btn">
                                        <Tooltip title='copy note'>
                                            <ContentCopyIcon style={{ cursor: "pointer" }} />
                                        </Tooltip>
                                    </div> : null
                                }
                                <div className="share-btn" onClick={() => copyLink(location.href)}>
                                    <Tooltip title='copy link'>
                                        <LinkIcon style={{ cursor: "pointer" }} />
                                    </Tooltip>
                                </div>
                            </div>

                        </div>
                        <div className="date">
                            {note?.updatedAt?.toString()?.substr(0, 10)}
                        </div>
                        <TextareaAutosize name='desc' disabled={permission ? false : true} value={note.desc || ''} onChange={handleChange}
                            style={{ fontSize: "1.1rem", background: "transparent" }} />
                    </div> : null
            }
        </div>
    )
}

export default Note