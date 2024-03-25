import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Owner from "../compo/Owner";
import LinkIcon from "@mui/icons-material/Link";
import { Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getNote } from "../services/note";
import { useDispatch, useSelector } from "react-redux";
import { status } from "../redux/slices/authSlice";
import {   updatenote } from "../util/common";
import { debounceDelay } from "../util/constant";
import Loading from "../compo/loading";
import Editor from "../compo/editor";
import { changeHeader } from "../redux/slices/headerSlice";

function Note() {
  const navigate = useNavigate();
  const { token, authStatus } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.notes);

  const dispatch = useDispatch();

  const { noteId } = useParams();

  const [note, setnote] = useState(null);
  const [permission, setpermission] = useState(false);

  const fetchNote = async (key) => {
    let data = await getNote(key, token, dispatch);
    if (data.err) {
      navigate("/123/pagenotefound");
    } else {
      setnote(data.msg.data);
      setpermission(data.msg.permission);
      dispatch(
        changeHeader(data.msg.data)
      );
    }
  };

  useEffect(() => {
    fetchNote(noteId);
  }, [noteId]);

  useEffect(() => {
    let timeId;

    if (note && note.hasChanged) {
      let newnote = {
        title: note.title,
        desc: note.desc,
      };

      timeId = setTimeout(
        () => updatenote(note._id, newnote, token, dispatch),
        debounceDelay
      );
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [note]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {note ? (
        <div className="note-page">
          {permission ? null : <Owner name={note.section.user.name} />}

          <Editor
            text={note.desc}
            onChange={(e) => {
              setnote({
                ...note,
                desc: JSON.stringify(e.document),
                hasChanged: true,
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
}

export default Note;
