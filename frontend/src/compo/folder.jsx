import React, { useContext, useEffect, useRef, useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { LinkContex } from '../contex/LinkContex';
import { dirApi } from '../config/apis';
import toast from 'react-hot-toast';

function Folder({ folder, folderInfo }) {

    let { dispatchLink } = useContext(LinkContex);
    let navigate = useNavigate();

    let [desc, setdesc] = useState("");
    let [title, settitle] = useState("");
    let [tid, setid] = useState(null);

    let updateFolder = async () => {
        let newfolder = {
            title: title,
            desc: desc
        }

        // debouncing
        if (tid) clearTimeout(tid);

        dispatchLink({ type: "UP_LINK", key: folderInfo._id, payload: newfolder });

        let some = setTimeout(async () => {

            let res = await fetch(dirApi + folder, {
                method: "PUT",
                headers: {
                    'authorization': localStorage.getItem('taskAuth'),
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newfolder)
            });

            let data = await res.json();

            if (!data.success) {
                toast.error("something went wrong", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
            }
        }, 1000);

        setid(some);
    }

    useEffect(() => {
        if (title && desc && ((title != folderInfo?.title) || (desc != folderInfo?.desc))) {
            updateFolder();
        }
    }, [title, desc])


    let deleleFolder = async () => {
        let ok = confirm("are u sure want to delete folder?");
        if (ok) {
            let tid = toast.loading("deleting");
            let res = await fetch(dirApi + folder, {
                method: "DELETE",
                headers: {
                    'authorization': localStorage.getItem('taskAuth')
                }
            })
            let data = await res.json();

            if (data.success) {
                dispatchLink({ type: "DLT_LINK", key: data.msg });
                navigate("/");
                toast.success("folder deleted", {
                    id: tid,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
            }
        }
    }

    useEffect(() => {
        if (folderInfo) {
            settitle(folderInfo.title);
            setdesc(folderInfo.desc);
        }
    }, [folderInfo])

    return (
        <>
            {
                folderInfo ? <div className="folder">
                    <div className="title" >

                        <input value={title || ''} onChange={(e) => {
                            settitle(e.target.value)
                        }} className='f_title' type="text" />
                        <div className="dlt_folder" onClick={deleleFolder}>
                            <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                        </div>
                    </div>
                    <div className="date">
                        {folderInfo?.date?.toString()?.substr(0, 10)}
                    </div>
                    <TextareaAutosize value={desc || ''} onChange={(e) => setdesc(e.target.value)}
                        maxRows={6} style={{ fontSize: "1.1rem", background: "transparent", maxWidth: "600px" }} />

                </div> : null
            }
        </>

    )
}

export default Folder
