import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Task from '../compo/task';
import Folder from '../compo/folder';
import { MainContex } from '../contex/mainContex'
import Bigtask from '../compo/bigTask'
import { AuthContex } from '../contex/AuthContex';
import { dirApi } from '../config/apis'
import LoadingBar from 'react-top-loading-bar'

function Dir() {

  const { tasks, dispatch, BigtaskRef, setactive } = useContext(MainContex);

  let { folder } = useParams();

  let [isadd, setisadd] = useState(true);

  let load = useRef(null);

  let [folderInfo, setfolderInfo] = useState(null);


  let navigate = useNavigate();

  // i am using same component for adding new task and for updating or see (big task)
  // so to differeciate between adding & updating i am using isadd

  let openAddTask = () => {
    setisadd(true);
    setactive({ title: "", desc: "" });
    BigtaskRef.current.classList.add('back_active');
  }

  useEffect(() => {

    let fetchfolder = async () => {
      load.current.staticStart();

      let res = await fetch(dirApi + folder, {
        headers: { 'authorization': localStorage.getItem('taskAuth') }
      }
      );
      let data = await res.json();

      if (data.success) {
        dispatch({
          type: "SET_TASK",
          payload: data.msg.tasks
        })
        setfolderInfo(data.msg.dir)
      } else {
        navigate("/123/pagenotfound");
      }
      load.current.complete();

    }

    fetchfolder();

  }, [folder])

  return (

    <div className="right">
      <LoadingBar color='#5469d4' ref={load} />
      {
        folderInfo && 
        <>
          <Bigtask folder={folder} isadd={isadd} />

          <Folder folder={folder} folderInfo={folderInfo} />

          <Divider />

          <div className="addtask">
            <div className="open_task">
              <h3 style={{ marginRight: 10 }}>Add task</h3>
              <div className="add_btn" onClick={openAddTask}>
                <AddCircleIcon style={{ fontSize: '3rem', color: '#5469d4', cursor: "pointer" }} />
              </div>
            </div>
          </div>

          <div className="tasks">
            {
              tasks?.map((task) => {
                return (
                  <Task
                    folder={folder}
                    key={task._id}
                    task={task}
                    setisadd={setisadd}
                  />
                )
              })
            }
          </div>
        </>
      }
    </div>


  )
}

export default Dir