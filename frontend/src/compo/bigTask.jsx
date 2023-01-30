import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Divider,
  TextField,
  Checkbox
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MainContex } from '../contex/mainContex'
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { taskApi } from '../config/apis';
import toast from 'react-hot-toast';

// same component for editing task(big task) and adding new task and seeing the notifications

// for editing  task, component should be rendered with old task filled up details

// for adding new task, component should renderd with some default values

// for seeing notification add,update button should not work, reminder also can't be set in notifications & input field must be disabled

function BigTask({ folder, isadd, noti }) {
  const navigate = useNavigate();

  const { dispatch, deleteTask, BigtaskRef, activetask } = useContext(MainContex);

  let [isreminder, setreminder] = useState(false);
  let [dateTime, setDateTime] = useState(new Date());
  let [dateerr, seterr] = useState(false);

  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  let updateTask = async (key) => {
    if (noti) return;

    if (dateerr) {
      toast.error("invalid date in reminder", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      return;
    }

    let newTask = {
      title: title,
      desc: desc,
      date: new Date(),
      reminder: isreminder ? dateTime : null
    }

    let tid = toast.loading("updating task");

    let res = await fetch(`${taskApi}${folder}/${key}`, {
      method: "PUT",
      headers: {
        'authorization': localStorage.getItem('taskAuth'),
        'Content-Type': "application/json"
      },
      body: JSON.stringify(newTask)
    })
    let data = await res.json();

    if (data.success) {
      dispatch({
        type: "UP_TASK",
        key: key,
        payload: data.msg
      })
      BigtaskRef.current.classList.remove('back_active');
      toast.success("Task updated", {
        id: tid,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })

    }
  }

  let addTask = async () => {

    if (noti) return;

    if (dateerr) {
      toast.error("invalid date in reminder", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    let tid = toast.loading("adding task");

    let task = {
      title: title == "" ? "undefined" : title,
      desc: desc == "" ? "undefined" : desc,
      reminder: isreminder ? dateTime : null
    }

    let res = await fetch(taskApi + folder, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': localStorage.getItem('taskAuth')
      },
      body: JSON.stringify(task)
    })

    let data = await res.json();
    if (data.success) {
      dispatch({
        type: "ADD_TASK",
        payload: data.msg
      })
      BigtaskRef.current.classList.remove('back_active');
      toast.success('Task added', {
        id: tid,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      setreminder(false);
    }

  }

  let closeBig = () => {
    setreminder(false);
    BigtaskRef.current.classList.remove('back_active');
  }

  useEffect(() => {
    if (isadd) {
      setreminder(false);
    }
  }, [isadd])

  useEffect(() => {
    if (activetask) {
      settitle(activetask.title);
      setdesc(activetask.desc);

      if (activetask.reminder) {
        setDateTime(activetask.reminder);
        setreminder(true);
      }
    }
    // active task change each time when clicking on add button and and clicking on any task
  }, [activetask])


  return (

    <div ref={BigtaskRef} onClick={(e) => {
      if (e.target.classList.contains("back")) {
        closeBig();
      }
    }} className="back"
    >

      {activetask &&
        <div className="bigTask">
          <div className="big_top">
            <div className="big_title">

              <input disabled={noti ? true : false} placeholder='title' type="text" value={title} onChange={(e) => {
                settitle(e.target.value)
              }} className="t_title" />

              <div className="big_btn_grp">
                {
                  !noti &&
                  <>
                    <div className="add_big" onClick={() => { isadd ? addTask() : updateTask(activetask?._id) }}>
                      <LibraryAddCheckIcon style={{ cursor: "pointer", color: "blue" }} />
                    </div>
                    {
                      !isadd &&

                      <div className="dlt_big" onClick={() => {
                        deleteTask(folder, activetask?._id)
                        navigate("/" + folder);
                      }
                      }>
                        <DeleteForeverIcon style={{ cursor: "pointer", color: "red" }} />
                      </div>
                    }

                  </>
                }

                <div className="big_close" onClick={closeBig}>
                  <ClearIcon style={{ cursor: "pointer" }} />
                </div>

                <div className="big_back" onClick={closeBig}>
                  <KeyboardBackspaceIcon style={{ cursor: "pointer" }} />
                </div>

              </div>

            </div>

            {!isadd && <span>{activetask?.date?.toString()?.substr(0, 10)}</span>}

            {
              noti && <span style={{ color: "blue" }}> /{activetask.folder} </span>
            }

          </div>
          <Divider />


          <TextareaAutosize disabled={noti ? true : false} placeholder='your desc'
            value={desc} onChange={(e) => setdesc(e.target.value)}
            minRows={3} />
          {
            !noti &&
            <div className="reminder">

              <div className="choice">
                {
                  activetask?.reminder ?
                    <div className="set_msg">Reminder</div> :
                    <div className="set">
                      <Checkbox checked={isreminder} onChange={() => {
                        setreminder(!isreminder);
                        setDateTime(Date.now())
                      }} /><div className="text">setReminder</div>
                    </div>
                }
              </div>
              {
                isreminder &&
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <DateTimePicker
                    onError={(reason) => {
                      if (reason) {
                        seterr(true);
                      } else {
                        seterr(false);
                      }
                    }}
                    value={dateTime}
                    onChange={(val) => setDateTime(val)}
                    renderInput={(params) => {
                      return (
                        <TextField {...params} />
                      )
                    }}
                  />
                </LocalizationProvider>
              }
            </div>
          }
        </div>
      }

    </div >

  )
}

export default BigTask

 