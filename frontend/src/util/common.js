import toast from "react-hot-toast";
import {
    deleteNote as deleteNoteAction,
    updateNote as updateNoteAction
} from "../redux/slices/noteSlice";
import { deleteNote, updateNote } from "../services/note";

export let updatenote = async (key, newnote, token, dispatch) => {
    let tid = toast.loading("updating note");
    let data = await updateNote(key, token, newnote);
    if (data.err) return data;
    dispatch(updateNoteAction(data.msg))
    toast.success("note updated", {
        id: tid
    })
    return data;
}

export let deletenote = async (key, token, dispatch) => {
    let ok = confirm('are you sure want to delete note?');
    if (ok) {
        let tid = toast.loading("deleting note");
        let data = await deleteNote(key, token);
        if (data.err) return data;
        dispatch(deleteNoteAction(key));
        toast.success("deleted successed", {
            id: tid
        })
        return data;
    }
}