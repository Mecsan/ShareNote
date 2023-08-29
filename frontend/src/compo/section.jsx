import React, { useContext, useEffect, useRef, useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { LinkContex } from '../contex/LinkContex';
import toast from 'react-hot-toast';
import Owner from './Owner';
import LinkIcon from '@mui/icons-material/Link';
import {
    Tooltip,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { copySection as copy, deleteSection, updateSection } from '../services/section';
import { useSelector } from 'react-redux';
import { status } from '../redux/slices/authSlice';

function Section({ section, sectionInfo, permission }) {

    let { dispatchLink } = useContext(LinkContex);
    let { token, authStatus } = useSelector(state => state.auth)
    let navigate = useNavigate();

    let [desc, setdesc] = useState("");
    let [title, settitle] = useState("");

    let updateSectionDb = async (ddata) => {

        let data = await updateSection(token, section, ddata);
        if (data.err) {
            toast.error("something went wrong", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        }
    }

    useEffect(() => {
        let some
        if (permission && title && desc && ((title != sectionInfo?.title) || (desc != sectionInfo?.desc))) {
            let newsection = {
                title: title,
                desc: desc
            }

            dispatchLink({ type: "UP_LINK", key: sectionInfo._id, payload: newsection });

            some = setTimeout(() => updateSectionDb(newsection), 1500);
        }

        return () => {
            clearTimeout(some);
        }
    }, [title, desc])


    let delelesection = async () => {
        if (!permission) return;
        let ok = confirm("are u sure want to delete section?");
        if (ok) {
            let tid = toast.loading("deleting");
            let data = await deleteSection(token, section);
            if (data.err) return;
            dispatchLink({ type: "DLT_LINK", key: data.msg });
            navigate("/");
            toast.success("section deleted", {
                id: tid,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        }
    }
    let copyLink = (link) => {
        toast.success("copied")
        navigator.clipboard.writeText(link);
    }

    let copySection = async () => {
        const tid = toast.loading("copying", {
            duration: Infinity
        })
        let data = await copy(token, sectionInfo._id);
        if (data.err) {
            toast.error('something went wrong', { id: tid, duration: 2000 });
        } else {
            toast.success('copied successfully', { id: tid, duration: 2000 })
            dispatchLink({ type: "ADD_LINK", payload: data.msg })
        }

    }
    useEffect(() => {
        if (sectionInfo) {
            settitle(sectionInfo.title);
            setdesc(sectionInfo.desc);
        }
    }, [sectionInfo])

    return (
        <>
            {
                sectionInfo ? <div className="section">

                    {permission ? null : <Owner name={sectionInfo.user.name} />}

                    <div className="title" >

                        <input disabled={permission ? false : true} value={title || ''} onChange={(e) => {
                            settitle(e.target.value)
                        }} className='f_title' type="text" />

                        <div className="big_btn_grp">
                            {
                                permission ?
                                    <div className="dlt_section" onClick={delelesection}>
                                        <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                                    </div> : null
                            }
                            {
                                authStatus == status.AUTH ? <div className="copy-btn" onClick={copySection}>
                                    <Tooltip title='copy section'>
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
                        {sectionInfo?.updatedAt?.toString()?.substr(0, 10)}
                    </div>
                    <TextareaAutosize disabled={permission ? false : true} value={desc || ''} onChange={(e) => setdesc(e.target.value)}
                        maxRows={6} style={{ fontSize: "1.1rem", background: "transparent", maxWidth: "600px" }} />

                </div> : null
            }
        </>

    )
}

export default Section
