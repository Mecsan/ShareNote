import React, { useReducer } from 'react'
import { createContext, useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { taskApi } from '../config/apis'
export const MainContex = createContext();

function MainContexProvider(props) {

    let [tasks, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_TASK":
                return { tasks: action.payload };
            case "ADD_TASK":
                return { tasks: [action.payload, ...state.tasks] };
            case "DLT_TASK":
                return {
                    tasks: state.tasks.filter((task) => {
                        return task._id != action.key
                    })
                };
            case "UP_TASK":
                return {
                    tasks: state.tasks.map((task) => {
                        if (task._id == action.key) {
                            return action.payload;
                        }
                        return task;
                    })
                };
            default:
                return state
        }
    }, {
        tasks: []
    })


    let [notis, setnotis] = useState(null);
    let [activetask, setactive] = useState(null);

    let BigtaskRef = useRef(null);
    // for transition
    
    let [user, setuser] = useState(null);

    let deleteTask = async (folder, key) => {
        let ok = confirm('are you sure want to delete Task?');
        if (ok) {
            try {

                let tid = toast.loading("deleting task");
                let res = await fetch(`${taskApi}${folder}/${key}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': localStorage.getItem('taskAuth')
                    }
                })
                let data = await res.json();
                if (data.success) {
                    dispatch({
                        type: "DLT_TASK",
                        key: key
                    });
                    toast.success("deleted successed", {
                        id: tid,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

                }
                if (BigtaskRef.current) {
                    BigtaskRef.current.classList.remove('back_active')
                }
            } catch (e) {
                console.log(e);
            }

        }
    }

    return (
        <MainContex.Provider value={{
            ...tasks, dispatch,
            user, setuser,
            notis, setnotis,
            activetask, setactive,
            deleteTask, BigtaskRef,
        }}>
            {props.children}
        </MainContex.Provider>
    )
}

export default MainContexProvider