import React, { useContext } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../redux/slices/noteSlice';
import { openBig } from '../util/constant';
import { deletenote } from '../util/common';

function Note({ note, setisadd, permission }) {

    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    let OpenBignote = (e) => {
        setisadd(false);
        dispatch(setActive(note))
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
                                    deletenote(note._id, token, dispatch)
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