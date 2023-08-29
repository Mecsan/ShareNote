import React, { useContext } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MainContex } from '../contex/mainContex';
import { useSelector } from 'react-redux';

function Note({ note, setisadd, permission }) {

    const { setactive, deletenote, openBig } = useContext(MainContex);
    const { user } = useSelector(state => state.auth)

    let OpenBignote = (e) => {
        setisadd(false);
        setactive(note);
        openBig();
    }

    return (
        <div className='note' onClick={(e) => OpenBignote(e)}>
            <div className="note_top">

                <h4 className='note_title'>{note.title}</h4>

                {
                    permission ?
                        <div className="btn_grp">
                            {
                                <div className="small_dlr" onClick={(e) => {
                                    if (!permission) return
                                    e.stopPropagation();
                                    deletenote(note._id)
                                }}>
                                    <DeleteOutlineIcon style={{ color: "red" }} />
                                </div>
                            }
                        </div> : null
                }

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