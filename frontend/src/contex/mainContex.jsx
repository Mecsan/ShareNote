import React, { useReducer } from 'react'
import { createContext, useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { noteApi } from '../config/apis'
export const MainContex = createContext();

function MainContexProvider(props) {

    let [notes, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_NOTE":
                return { notes: action.payload };
            case "ADD_NOTE":
                return { notes: [action.payload, ...state.notes] };
            case "DLT_NOTE":
                return {
                    notes: state.notes.filter((note) => {
                        return note._id != action.key
                    })
                };
            case "UP_NOTE":
                return {
                    notes: state.notes.map((note) => {
                        if (note._id == action.key) {
                            return action.payload;
                        }
                        return note;
                    })
                };
            default:
                return state
        }
    }, {
        notes: []
    })


    let [activenote, setactive] = useState(null);

    let BignoteRef = useRef(null);
    // for transition

    let deletenote = async (key) => {
        let ok = confirm('are you sure want to delete note?');
        if (ok) {
            try {
                let tid = toast.loading("deleting note");
                let res = await fetch(`${noteApi}${key}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': localStorage.getItem('noteAuth')
                    }
                })
                let data = await res.json();
                if (data.success) {
                    dispatch({
                        type: "DLT_NOTE",
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
                if (BignoteRef.current) {
                    BignoteRef.current.classList.remove('back_active')
                }
            } catch (e) {
                console.log(e);
            }

        }
    }

    return (
        <MainContex.Provider value={{
            ...notes, dispatch,
            activenote, setactive,
            deletenote, BignoteRef,
        }}>
            {props.children}
        </MainContex.Provider>
    )
}

export default MainContexProvider