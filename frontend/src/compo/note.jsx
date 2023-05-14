import React, { useContext, useState } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MainContex } from '../contex/mainContex';
import { AuthContex } from '../contex/AuthContex';

function Note({ note, setisadd }) {

    const { deletenote, BignoteRef, setactive } = useContext(MainContex);
    const {user} = useContext(AuthContex)

    let OpenBignote = (e) => {
        setisadd(false);
        if (e.target.classList.contains('note_desc') ||
            e.target.classList.contains('note_title') ||
            e.target.classList.contains('note_top') ||
            e.target.classList.contains('note') ||
            e.target.classList.contains('date')) {
            setactive(note);
            BignoteRef.current.classList.add('back_active')
        }

    }

    return (
        <div className='note' onClick={(e) => OpenBignote(e)}>
            <div className="note_top">

                <h4 className='note_title'>{note.title}</h4>

                <div className="btn_grp">
                    {
                        <div className="small_dlr" onClick={() => { deletenote(note._id) }}>
                            <DeleteOutlineIcon style={{ color: "red" }} />
                        </div>
                    }
                </div>

            </div>

            {user?.isDate &&
                <div className="date">{note?.updatedAt?.toString().substr(0, 10)}</div>
            }

            {
                user?.isDesc ?
                    <p className='note_desc'>
                        {note.desc.length < 150 ? note.desc :
                            <>
                                {note.desc.substr(0, 151)}
                                <span style={{ color: "blue", fontSize: '1rem' }}> ...</span>
                            </>
                        }
                    </p> : null
            }

        </div>
    )
}

export default Note