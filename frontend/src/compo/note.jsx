import React from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { deletenote } from "../util/common";

function Note({ note, permission }) {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let seeNote = (e) => {
    navigate("/note/" + note._id);
  };

  return (
    <div className="note" onClick={(e) => seeNote(e)}>
      <div className="note_top">
        <h4 className="note_title">{note.title}</h4>

        {permission ? (
          <div className="btn_grp">
            {
              <div
                className="small_dlr"
                onClick={(e) => {
                  if (!permission) return;
                  e.stopPropagation();
                  deletenote(note._id, token, dispatch);
                }}
              >
                <DeleteOutlineIcon style={{ color: "red" }} />
              </div>
            }
          </div>
        ) : null}
      </div>

      <div className="date">{note?.updatedAt?.toString().substr(0, 10)}</div>
    </div>
  );
}

export default Note;
