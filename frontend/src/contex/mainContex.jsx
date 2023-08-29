import React, { useReducer } from 'react'
import { createContext, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateNote as updateNoteAction,
    deleteNote as deleteNoteAction
} from '../redux/slices/noteSlice';
import { deleteNote, updateNote as updateNode } from '../services/note';
export const MainContex = createContext();

function MainContexProvider(props) {

    const openBig = () => {
        document.querySelector(".bigNoteRef").classList.add('back_active')
    }

    const closeBig = () => {
        document.querySelector(".bigNoteRef").classList.remove('back_active')
    }

    let { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    async function updateNote(key, newnote) {
        let tid = toast.loading("updating note");
        let data = await updateNode(key, token, newnote);
        if (data.err) return data;
        dispatch(updateNoteAction(data.msg))
        toast.success("note updated", {
            id: tid,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
        return data;
    }

    let deletenote = async (key) => {
        let ok = confirm('are you sure want to delete note?');
        if (ok) {
            let tid = toast.loading("deleting note");
            let data = await deleteNote(key, token);
            if (data.err) return data;
            dispatch(deleteNoteAction(key));
            toast.success("deleted successed", {
                id: tid,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
            return data;
        }
    }

    return (
        <MainContex.Provider value={{
            deletenote,
            updateNote,
            openBig,
            closeBig
        }}>
            {props.children}
        </MainContex.Provider>
    )
}

export default MainContexProvider