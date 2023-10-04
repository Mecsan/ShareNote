import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Owner from '../compo/Owner';
import LinkIcon from '@mui/icons-material/Link';
import {
    Tooltip,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import { getNote } from '../services/note';
import { useDispatch, useSelector } from 'react-redux';
import { status } from '../redux/slices/authSlice';
import { setCopy } from '../redux/slices/noteSlice';
import { deletenote, updatenote } from '../util/common';
import { debounceDelay, styles } from '../util/constant';
import Loading from '../compo/loading';
import { themes } from '../redux/slices/themSlice';

function Note() {

    const navigate = useNavigate();
    const { token, authStatus } = useSelector(state => state.auth);
    const { loading } = useSelector(state => state.notes);
    const { theme } = useSelector(state => state.theme)

    const dispatch = useDispatch();

    const { noteId } = useParams();

    const [note, setnote] = useState(null);
    const [permission, setpermission] = useState(false);
    const [time, settime] = useState(null);

    const fetchNote = async (key) => {
        let data = await getNote(key, token, dispatch);
        if (data.err) {
            navigate("/123/pagenotefound");
        } else {
            setnote(data.msg.data);
            setpermission(data.msg.permission);
        }
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

    let copyLink = (link) => {
        toast.success("copied")
        navigator.clipboard.writeText(link);
    }

    const handledelet = async () => {
        if (!permission) return
        const data = await deletenote(note?._id, token, dispatch)
        if (!data || data.err) return;
        navigate("/");
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
        const timeId = setTimeout(() => updatenote(note._id, newnote, token, dispatch), debounceDelay);
        settime(timeId)
    }


    useEffect(() => {
        fetchNote(noteId)
    }, [noteId])

    let rows = Math.floor(innerHeight / 35);

    if (loading) {
        return (<Loading />)
    }
    return (
        <div className="right" >
            {
                note ?
                    <div className="note-page">
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
                                    authStatus == status.AUTH ? <div className="copy-btn" onClick={() => copyNote(note)}>
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

                        <TextareaAutosize
                            name='desc' disabled={permission ? false : true} value={note.desc || ''} onChange={handleChange}
                            style={{
                                fontSize: "1.1rem", background: "transparent",
                                color: theme == themes.LIGHT ? styles.light.btn : styles.dark.btn
                            }} />
                    </div> : null
            }
        </div>
    )
}

export default Note