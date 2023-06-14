import React, { useReducer } from 'react'
import { useContext } from 'react';
import { createContext, useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { noteApi } from '../config/apis';
import { AuthContex } from './AuthContex';
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

    // to copy a note
    let [copynote, setcopy] = useState({
        isCopy: false,
        title: "",
        desc: ""
    })

    const openBig = () => {
        document.querySelector(".bigNoteRef").classList.add('back_active')
    }

    const closeBig = () => {
        document.querySelector(".bigNoteRef").classList.remove('back_active')
    }

    const { auth } = useContext(AuthContex)

    async function updateNote(key, newnote) {

        let tid = toast.loading("updating note");

        let res = await fetch(`${noteApi}${key}`, {
            method: "PUT",
            headers: {
                'authorization': auth,
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newnote)
        })
        let data = await res.json();

        if (data.success) {
            dispatch({
                type: "UP_NOTE",
                key: key,
                payload: data.msg
            })
            toast.success("note updated", {
                id: tid,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        }
        return data;
    }

    let deletenote = async (key) => {
        let ok = confirm('are you sure want to delete note?');
        if (ok) {
            let tid = toast.loading("deleting note");
            let res = await fetch(`${noteApi}${key}`, {
                method: "DELETE",
                headers: {
                    'authorization': auth
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
            return data
        }
    }

    return (
        <MainContex.Provider value={{
            ...notes, dispatch,
            activenote, setactive,
            deletenote,
            updateNote,
            copynote, setcopy,
            openBig, closeBig
        }}>
            {props.children}
        </MainContex.Provider>
    )
}

export default MainContexProvider