import React, { useContext } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { MainContex } from '../contex/mainContex';
import { notiApi } from '../config/apis';

export function Noti({ noti }) {

    let { setactive, BigtaskRef, setnotis } = useContext(MainContex)

    let seen_noti = async () => {

        let res = await fetch(notiApi + noti._id, {
            headers: {
                'authorization': localStorage.getItem('taskAuth')
            }
        })
        let data = await res.json();
        if (data.success) {
            setnotis((pre) => {
                return pre.map((pr) => {
                    if (pr._id == noti._id) {
                        return {
                            ...pr,
                            hasNoticed: true
                        }
                    }
                    return pr;
                })
            })
        }

    }

    let dltNoti = async () => {
        let res = await fetch(notiApi + noti._id, {
            method: "DELETE",
            headers: {
                'authorization': localStorage.getItem('taskAuth')
            }
        })
        let data = await res.json();
        if (data.success) {
            setnotis((pre) => {
                return pre.filter((one) => one._id != noti._id)
            })
        }
    }
    let OpenBigTask = (e) => {
        if (!noti.hasNoticed) {
            seen_noti();
        }
        if (e.target.classList.contains('task_desc') ||
            e.target.classList.contains('task_title') ||
            e.target.classList.contains('task_top') ||
            e.target.classList.contains('task') ||
            e.target.classList.contains('date')) {
            setactive(noti);
            BigtaskRef.current.classList.add('back_active')
        }
    }

    return (
        <div className='task' onClick={(e) => OpenBigTask(e)}>
            <div className="task_top">

                <h4 className='task_title'>{noti.title}</h4>


                <div className="btn_grp">
                    {
                        <div className="small_dlr" onClick={dltNoti}>
                            <DeleteOutlineIcon style={{ color: "red" }} />
                        </div>
                    }
                    {
                        !noti.hasNoticed && < CircleNotificationsIcon />
                    }
                </div>

            </div>

            <div className="date">{`${noti.date.toString().substr(11, 5)} / ${noti.date.toString().substr(0, 10)}`}</div>
            <span style={{ color: "blue" }}> /{noti.folder} </span>

            <p className='task_desc'>
                {noti.desc.length < 150 ? noti.desc :
                    <>
                        {noti.desc.substr(0, 151)}
                        <span style={{ color: "blue", fontSize: '1rem' }}> ...</span>
                    </>
                }
            </p>

        </div>
    )
}
