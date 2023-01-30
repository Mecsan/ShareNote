import React, { useContext, useState } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MainContex } from '../contex/mainContex';

function Task({ task, folder,setisadd }) {

    const { user, deleteTask, BigtaskRef, setactive } = useContext(MainContex);

    let OpenBigTask = (e) => {
        setisadd(false);
        if (e.target.classList.contains('task_desc') ||
            e.target.classList.contains('task_title') ||
            e.target.classList.contains('task_top') ||
            e.target.classList.contains('task') ||
            e.target.classList.contains('date')) {
            setactive(task);
            BigtaskRef.current.classList.add('back_active')
        }

    }

    return (
        <div className='task' onClick={(e) => OpenBigTask(e)}>
            <div className="task_top">
                {
                    user?.isTitle &&
                    <h4 className='task_title'>{task.title}</h4>
                }

                <div className="btn_grp">
                    {
                        <div className="small_dlr" onClick={() => { deleteTask(folder, task._id) }}>
                            <DeleteOutlineIcon style={{ color: "red" }} />
                        </div>
                    }
                </div>

            </div>

            {user?.isDate &&
                <div className="date">{task.date.toString().substr(0, 10)}</div>
            }

            <p className='task_desc'>
                {task.desc.length < 150 ? task.desc :
                    <>
                        {task.desc.substr(0, 151)}
                        <span style={{ color: "blue", fontSize: '1rem' }}> ...</span>
                    </>
                }
            </p>

        </div>
    )
}

export default Task